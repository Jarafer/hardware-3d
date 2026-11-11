using System;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

internal static class AbrirLibro
{
    private static readonly string Site = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "libro");

    private static int Main(string[] args)
    {
        try
        {
            if (!File.Exists(Path.Combine(Site, "index.html")))
                throw new IOException("Falta la carpeta libro. Extraé todo el ZIP.");

            var server = StartServer();
            string url = "http://127.0.0.1:" + ((IPEndPoint)server.LocalEndpoint).Port + "/";
            Console.WriteLine("Hardware 3D | Taller de Hardware");
            Console.WriteLine("Abrí " + url + " en tu navegador.");
            Console.WriteLine("Dejá esta ventana abierta mientras usás el libro.");
            if (Array.IndexOf(args, "--sin-abrir") < 0)
            {
                try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); }
                catch (System.ComponentModel.Win32Exception) { Console.WriteLine("Copiá la dirección de arriba en el navegador."); }
            }

            while (true)
            {
                var client = server.AcceptTcpClient();
                ThreadPool.QueueUserWorkItem(_ => Serve(client));
            }
        }
        catch (Exception error)
        {
            Console.Error.WriteLine(error.Message);
            if (!Console.IsInputRedirected)
            {
                Console.WriteLine("Presioná Enter para salir.");
                Console.ReadLine();
            }
            return 1;
        }
    }

    private static TcpListener StartServer()
    {
        for (int port = 4185; port <= 4194; port++)
        {
            var server = new TcpListener(IPAddress.Loopback, port);
            server.ExclusiveAddressUse = true;
            try
            {
                server.Start();
                return server;
            }
            catch (SocketException error)
            {
                server.Stop();
                if (error.SocketErrorCode != SocketError.AddressAlreadyInUse &&
                    error.SocketErrorCode != SocketError.AccessDenied) throw;
            }
        }
        throw new IOException("Los puertos locales 4185 a 4194 no están disponibles.");
    }

    private static string ReadRequest(Stream stream)
    {
        byte[] data = new byte[8192];
        for (int i = 0; i < data.Length; i++)
        {
            int value = stream.ReadByte();
            if (value < 0) return null;
            data[i] = (byte)value;
            if (i >= 3 && data[i - 3] == 13 && data[i - 2] == 10 && data[i - 1] == 13 && data[i] == 10)
                return Encoding.ASCII.GetString(data, 0, i + 1);
        }
        return null;
    }

    private static void Serve(TcpClient client)
    {
        using (client)
        {
            client.ReceiveTimeout = 5000;
            client.SendTimeout = 10000;
            Stream network = client.GetStream();
            try
            {
                string request = ReadRequest(network);
                if (request == null) return;
                int end = request.IndexOf("\r\n", StringComparison.Ordinal);
                string[] parts = request.Substring(0, end).Split(' ');
                if (parts.Length != 3 || !parts[1].StartsWith("/", StringComparison.Ordinal))
                {
                    Respond(network, "400 Bad Request");
                    return;
                }
                if (parts[0] != "GET" && parts[0] != "HEAD")
                {
                    Respond(network, "405 Method Not Allowed", extra: "Allow: GET, HEAD\r\n");
                    return;
                }

                string relative = Uri.UnescapeDataString(parts[1].Split('?')[0]).TrimStart('/');
                if (relative.Length == 0) relative = "index.html";
                if (relative.IndexOfAny(new[] { ':', '\\', '\0' }) >= 0)
                {
                    Respond(network, "404 Not Found");
                    return;
                }
                string path = Path.GetFullPath(Path.Combine(Site, relative));
                if (!path.StartsWith(Site + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase) || !File.Exists(path))
                {
                    Respond(network, "404 Not Found");
                    return;
                }

                using (var file = File.OpenRead(path))
                {
                    Respond(network, "200 OK", MediaType(path), file.Length);
                    if (parts[0] == "GET") file.CopyTo(network);
                }
            }
            catch (ArgumentException) { }
            catch (IOException) { }
        }
    }

    private static void Respond(Stream stream, string status, string type = "text/plain", long length = 0, string extra = "")
    {
        string headers = "HTTP/1.1 " + status + "\r\nContent-Type: " + type +
            "\r\nContent-Length: " + length.ToString(CultureInfo.InvariantCulture) +
            "\r\nConnection: close\r\nX-Content-Type-Options: nosniff\r\n" + extra + "\r\n";
        byte[] bytes = Encoding.ASCII.GetBytes(headers);
        stream.Write(bytes, 0, bytes.Length);
    }

    private static string MediaType(string file)
    {
        switch (Path.GetExtension(file).ToLowerInvariant())
        {
            case ".html": return "text/html; charset=utf-8";
            case ".css": return "text/css; charset=utf-8";
            case ".js": return "text/javascript; charset=utf-8";
            case ".png": return "image/png";
            case ".jpg":
            case ".jpeg": return "image/jpeg";
            case ".svg": return "image/svg+xml";
            case ".webp": return "image/webp";
            case ".pdf": return "application/pdf";
            case ".ico": return "image/x-icon";
            default: return "application/octet-stream";
        }
    }
}
