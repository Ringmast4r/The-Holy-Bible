"""
Bible Cross-Reference Visualizer - Desktop Application
Interactive 3D and 2D visualizations using PyQt5
"""

import sys
import json
from pathlib import Path
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout,
                             QHBoxLayout, QTabWidget, QLabel, QPushButton,
                             QComboBox, QSlider, QGroupBox, QStatusBar)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont, QPalette, QColor

# Import visualization components
from components.network_view import NetworkView
from components.arc_view import ArcView
from components.heatmap_view import HeatmapView
from components.stats_view import StatsView


class BibleVisualizerApp(QMainWindow):
    """Main application window for Bible visualizations"""

    def __init__(self):
        super().__init__()
        self.data = None
        self.stats = None
        self.init_ui()
        self.load_data()

    def init_ui(self):
        """Initialize the user interface"""
        self.setWindowTitle('Bible Cross-Reference Visualizer - by @Ringmast4r')
        self.setGeometry(100, 100, 1400, 900)

        # Set dark theme
        self.set_dark_theme()

        # Create central widget and layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)

        # Add title
        title = QLabel('Bible Cross-Reference Visualizer')
        title_font = QFont('Arial', 20, QFont.Bold)
        title.setFont(title_font)
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet('color: #FFD700; padding: 10px;')
        main_layout.addWidget(title)

        # Add subtitle with attribution
        subtitle = QLabel('Created by @Ringmast4r')
        subtitle_font = QFont('Arial', 10)
        subtitle.setFont(subtitle_font)
        subtitle.setAlignment(Qt.AlignCenter)
        subtitle.setStyleSheet('color: #00CED1; padding: 0px 0px 10px 0px;')
        main_layout.addWidget(subtitle)

        # Create control panel
        controls = self.create_controls()
        main_layout.addWidget(controls)

        # Create tab widget for different visualizations
        self.tabs = QTabWidget()
        self.tabs.setStyleSheet("""
            QTabWidget::pane {
                border: 2px solid #FFD700;
                background: #1a1a2e;
            }
            QTabBar::tab {
                background: #16213e;
                color: #00CED1;
                padding: 10px 20px;
                margin: 2px;
                border: 1px solid #FFD700;
            }
            QTabBar::tab:selected {
                background: #FFD700;
                color: #1a1a2e;
                font-weight: bold;
            }
        """)

        # Add visualization tabs
        self.network_view = NetworkView()
        self.arc_view = ArcView()
        self.heatmap_view = HeatmapView()
        self.stats_view = StatsView()

        self.tabs.addTab(self.network_view, '3D Network Graph')
        self.tabs.addTab(self.arc_view, 'Arc Diagram')
        self.tabs.addTab(self.heatmap_view, 'Heatmap')
        self.tabs.addTab(self.stats_view, 'Statistics')

        main_layout.addWidget(self.tabs)

        # Add status bar
        self.status_bar = QStatusBar()
        self.status_bar.setStyleSheet('color: #00CED1; background: #16213e;')
        self.setStatusBar(self.status_bar)
        self.status_bar.showMessage('Ready')

    def create_controls(self):
        """Create control panel with filters"""
        controls_group = QGroupBox('Filters & Controls')
        controls_group.setStyleSheet("""
            QGroupBox {
                color: #FFD700;
                font-weight: bold;
                border: 2px solid #FFD700;
                margin-top: 10px;
                padding-top: 15px;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 10px;
                padding: 0 5px;
            }
        """)

        layout = QHBoxLayout()

        # Testament filter
        testament_label = QLabel('Testament:')
        testament_label.setStyleSheet('color: #00CED1;')
        self.testament_combo = QComboBox()
        self.testament_combo.addItems(['All', 'Old Testament', 'New Testament', 'Cross-Testament'])
        self.testament_combo.currentIndexChanged.connect(self.apply_filters)
        self.testament_combo.setStyleSheet("""
            QComboBox {
                background: #16213e;
                color: #00CED1;
                border: 1px solid #FFD700;
                padding: 5px;
                min-width: 150px;
            }
            QComboBox::drop-down {
                border: none;
            }
            QComboBox QAbstractItemView {
                background: #16213e;
                color: #00CED1;
                selection-background-color: #FFD700;
                selection-color: #1a1a2e;
            }
        """)

        # Min connections slider
        connections_label = QLabel('Min Connections:')
        connections_label.setStyleSheet('color: #00CED1;')
        self.connections_slider = QSlider(Qt.Horizontal)
        self.connections_slider.setMinimum(1)
        self.connections_slider.setMaximum(100)
        self.connections_slider.setValue(1)
        self.connections_slider.setTickPosition(QSlider.TicksBelow)
        self.connections_slider.setTickInterval(10)
        self.connections_slider.valueChanged.connect(self.apply_filters)
        self.connections_slider.setStyleSheet("""
            QSlider::groove:horizontal {
                border: 1px solid #FFD700;
                height: 8px;
                background: #16213e;
            }
            QSlider::handle:horizontal {
                background: #FFD700;
                border: 1px solid #FFD700;
                width: 18px;
                margin: -5px 0;
                border-radius: 9px;
            }
        """)
        self.connections_value = QLabel('1')
        self.connections_value.setStyleSheet('color: #FFD700; font-weight: bold;')

        # Reset button
        reset_btn = QPushButton('Reset Filters')
        reset_btn.clicked.connect(self.reset_filters)
        reset_btn.setStyleSheet("""
            QPushButton {
                background: #FFD700;
                color: #1a1a2e;
                border: none;
                padding: 8px 15px;
                font-weight: bold;
            }
            QPushButton:hover {
                background: #00CED1;
            }
        """)

        # Export button
        export_btn = QPushButton('Export Current View')
        export_btn.clicked.connect(self.export_view)
        export_btn.setStyleSheet("""
            QPushButton {
                background: #9370DB;
                color: white;
                border: none;
                padding: 8px 15px;
                font-weight: bold;
            }
            QPushButton:hover {
                background: #00CED1;
            }
        """)

        # Add widgets to layout
        layout.addWidget(testament_label)
        layout.addWidget(self.testament_combo)
        layout.addSpacing(20)
        layout.addWidget(connections_label)
        layout.addWidget(self.connections_slider)
        layout.addWidget(self.connections_value)
        layout.addSpacing(20)
        layout.addWidget(reset_btn)
        layout.addWidget(export_btn)
        layout.addStretch()

        controls_group.setLayout(layout)
        return controls_group

    def set_dark_theme(self):
        """Apply dark theme to application"""
        palette = QPalette()
        palette.setColor(QPalette.Window, QColor(26, 26, 46))
        palette.setColor(QPalette.WindowText, QColor(255, 255, 255))
        palette.setColor(QPalette.Base, QColor(22, 33, 62))
        palette.setColor(QPalette.AlternateBase, QColor(26, 26, 46))
        palette.setColor(QPalette.Text, QColor(0, 206, 209))
        palette.setColor(QPalette.Button, QColor(22, 33, 62))
        palette.setColor(QPalette.ButtonText, QColor(255, 215, 0))
        palette.setColor(QPalette.Highlight, QColor(255, 215, 0))
        palette.setColor(QPalette.HighlightedText, QColor(26, 26, 46))

        self.setPalette(palette)

    def load_data(self):
        """Load Bible cross-reference data"""
        try:
            # Load graph data
            data_path = Path(__file__).parent.parent / 'shared-data' / 'processed' / 'graph_data.json'
            stats_path = Path(__file__).parent.parent / 'shared-data' / 'processed' / 'stats.json'

            with open(data_path, 'r', encoding='utf-8') as f:
                self.data = json.load(f)

            with open(stats_path, 'r', encoding='utf-8') as f:
                self.stats = json.load(f)

            # Pass data to all views
            self.network_view.set_data(self.data)
            self.arc_view.set_data(self.data)
            self.heatmap_view.set_data(self.data)
            self.stats_view.set_data(self.stats)

            self.status_bar.showMessage(f'Loaded {len(self.data["connections"])} connections from {len(self.data["chapters"])} chapters')

        except FileNotFoundError:
            self.status_bar.showMessage('Error: Data files not found. Run data_processor.py first.')
        except Exception as e:
            self.status_bar.showMessage(f'Error loading data: {str(e)}')

    def apply_filters(self):
        """Apply current filter settings to all views"""
        testament = self.testament_combo.currentText()
        min_connections = self.connections_slider.value()
        self.connections_value.setText(str(min_connections))

        filters = {
            'testament': testament,
            'min_connections': min_connections
        }

        # Apply to current view
        current_view = self.tabs.currentWidget()
        if hasattr(current_view, 'apply_filters'):
            current_view.apply_filters(filters)

        self.status_bar.showMessage(f'Filters applied: Testament={testament}, Min Connections={min_connections}')

    def reset_filters(self):
        """Reset all filters to default"""
        self.testament_combo.setCurrentIndex(0)
        self.connections_slider.setValue(1)
        self.apply_filters()

    def export_view(self):
        """Export current view"""
        current_view = self.tabs.currentWidget()
        if hasattr(current_view, 'export'):
            current_view.export()
            self.status_bar.showMessage('View exported successfully')
        else:
            self.status_bar.showMessage('Export not available for this view')


def main():
    """Main application entry point"""
    app = QApplication(sys.argv)
    app.setApplicationName('Bible Visualizer')

    window = BibleVisualizerApp()
    window.show()

    sys.exit(app.exec_())


if __name__ == '__main__':
    main()
