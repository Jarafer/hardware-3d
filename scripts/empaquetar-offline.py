"""Genera el ZIP sin conexión desde una máquina de desarrollo Windows."""
import argparse
import os
from pathlib import Path
import shutil
import subprocess
from tempfile import TemporaryDirectory
from zipfile import ZIP_DEFLATED, ZipFile

PROJECT = Path(__file__).resolve().parents[1]

def package(destination):
    framework = Path(os.environ["WINDIR"]) / "Microsoft.NET"
    candidates = [framework / arch / "v4.0.30319/csc.exe" for arch in ("Framework64", "Framework")]
    compiler = next((candidate for candidate in candidates if candidate.is_file()), None)
    if compiler is None:
        raise SystemExit("No se encontró el compilador de .NET Framework de Windows.")

    subprocess.run(["npm.cmd", "run", "build"], cwd=PROJECT, check=True)
    with TemporaryDirectory(prefix="hardware-3d-", dir=PROJECT) as temp:
        staging = Path(temp)
        launcher = staging / "Abrir libro.exe"
        subprocess.run(
            [str(compiler), "/nologo", "/target:exe", "/codepage:65001",
             f"/out:{launcher}", str(PROJECT / "scripts/AbrirLibro.cs")],
            check=True,
        )
        root = Path("Hardware 3D sin conexion")
        with ZipFile(destination, "w", compression=ZIP_DEFLATED) as archive:
            archive.write(launcher, root / launcher.name)
            archive.write(PROJECT / "scripts/LEEME-sin-conexion.txt", root / "LEEME.txt")
            archive.write(PROJECT / "node_modules/three/LICENSE", root / "Licencia Three.js.txt")
            for asset in sorted((PROJECT / "dist").rglob("*")):
                if asset.is_file():
                    archive.write(asset, root / "libro" / asset.relative_to(PROJECT / "dist"))
    print(destination)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("destino", nargs="?", type=Path,
                        default=PROJECT.parent / "Hardware-3D-sin-conexion-Windows.zip")
    package(parser.parse_args().destino.resolve())
