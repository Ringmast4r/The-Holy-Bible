# -*- mode: python ; coding: utf-8 -*-
"""
PyInstaller spec file for Bible Visualizer Desktop GUI
Creates a standalone executable with all dependencies bundled
"""

import os

block_cipher = None

# Add Bible data files (graph_data.json and stats.json)
# These are in parent directory's shared-data folder
datas = []
shared_data_path = os.path.join('..', 'shared-data', 'processed')
if os.path.exists(shared_data_path):
    datas = [
        (os.path.join(shared_data_path, 'graph_data.json'), 'shared-data/processed'),
        (os.path.join(shared_data_path, 'stats.json'), 'shared-data/processed'),
    ]

# Hidden imports for components and key libraries
hiddenimports = [
    'components.network_view',
    'components.arc_view',
    'components.heatmap_view',
    'components.stats_view',
    'PyQt5.sip',
    'PyQt5.QtWebEngineWidgets',
    'PyQt5.QtWebChannel',
    'PyQt5.QtPrintSupport',
]

a = Analysis(
    ['visualizer_app.py'],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['pandas', 'pandas._libs'],  # Exclude pandas to avoid hook issues
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

# Create ONE-FOLDER distribution (more reliable than one-file)
exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='BibleVisualizer',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,  # No console window (GUI app)
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='BibleVisualizer',
)
