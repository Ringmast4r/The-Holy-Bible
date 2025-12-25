"""
2D Arc Diagram Visualization using Matplotlib
Beautiful arc-style cross-reference visualization
"""

from PyQt5.QtWidgets import QWidget, QVBoxLayout
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import matplotlib.pyplot as plt
import numpy as np


class ArcView(QWidget):
    """Arc diagram visualization component"""

    def __init__(self):
        super().__init__()
        self.data = None
        self.filtered_data = None
        self.init_ui()

    def init_ui(self):
        """Initialize UI"""
        layout = QVBoxLayout()
        self.setLayout(layout)

        # Create matplotlib figure (responsive size)
        self.figure = Figure(facecolor='#1a1a2e')
        self.canvas = FigureCanvas(self.figure)
        self.canvas.setSizePolicy(
            self.canvas.sizePolicy().horizontalPolicy(),
            self.canvas.sizePolicy().verticalPolicy()
        )
        layout.addWidget(self.canvas)

        # Set style
        plt.style.use('dark_background')

    def set_data(self, data):
        """Set data"""
        self.data = data
        # PERFORMANCE: Limit to top 1000 connections for arc diagram
        # Full 190K+ connections will freeze matplotlib
        limited_data = data.copy()
        limited_data['connections'] = sorted(
            data['connections'],
            key=lambda x: x['weight'],
            reverse=True
        )[:1000]
        self.filtered_data = limited_data
        self.render()

    def render(self):
        """Render arc diagram"""
        if not self.filtered_data:
            return

        self.figure.clear()
        ax = self.figure.add_subplot(111)
        ax.set_facecolor('#1a1a2e')

        chapters = self.filtered_data['chapters']
        connections = self.filtered_data['connections']

        # Create position mapping
        chapter_positions = {ch['id']: i for i, ch in enumerate(chapters)}
        num_chapters = len(chapters)

        # Draw chapter bars at bottom
        for i, chapter in enumerate(chapters):
            color = '#2ecc71' if chapter['testament'] == 'OT' else '#00CED1'
            ax.plot([i, i], [0, 0.05], color=color, linewidth=2, alpha=0.6)

        # Draw arcs
        max_weight = max(conn['weight'] for conn in connections) if connections else 1

        for conn in connections:
            source_pos = chapter_positions.get(conn['source'])
            target_pos = chapter_positions.get(conn['target'])

            if source_pos is None or target_pos is None:
                continue

            # Calculate arc
            x1, x2 = source_pos, target_pos
            if x1 > x2:
                x1, x2 = x2, x1

            distance = x2 - x1
            height = min(distance * 0.4, 100)

            # Arc color based on testament
            source_testament = chapters[source_pos]['testament']
            target_testament = chapters[target_pos]['testament']

            if source_testament == 'OT' and target_testament == 'OT':
                color = '#2ecc71'
            elif source_testament == 'NT' and target_testament == 'NT':
                color = '#00CED1'
            else:
                color = '#9370DB'

            # Arc width based on weight
            width = np.sqrt(conn['weight']) / 3

            # Draw bezier curve
            t = np.linspace(0, 1, 100)
            x = (1 - t) * x1 + t * x2
            y = 4 * height * t * (1 - t)

            ax.plot(x, y, color=color, linewidth=width, alpha=0.3)

        # Add book labels at regular intervals for ultrawide screens
        # Show every Nth book label based on screen width
        label_interval = max(1, num_chapters // 40)  # Show ~40 labels max

        current_book = None
        for i, chapter in enumerate(chapters):
            # Always show book name changes
            if chapter['book'] != current_book:
                current_book = chapter['book']
                color = '#2ecc71' if chapter['testament'] == 'OT' else '#00CED1'
                ax.text(i, -10, chapter['book'],
                       rotation=90, ha='right', va='top',
                       fontsize=8, color=color, alpha=0.8)

        # Styling - use full width
        ax.set_xlim(-5, num_chapters + 5)
        ax.set_ylim(-15, 120)
        ax.axis('off')
        ax.set_title(f'Bible Cross-Reference Arc Diagram ({len(connections)} connections shown)',
                     color='#FFD700', fontsize=16, fontweight='bold', pad=20)

        # Add legend
        from matplotlib.patches import Patch
        legend_elements = [
            Patch(facecolor='#2ecc71', label='Old Testament'),
            Patch(facecolor='#00CED1', label='New Testament'),
            Patch(facecolor='#9370DB', label='Cross-Testament')
        ]
        ax.legend(handles=legend_elements, loc='upper right',
                 facecolor='#16213e', edgecolor='#FFD700')

        # Tight layout to use all available space
        self.figure.tight_layout()
        self.canvas.draw()

    def apply_filters(self, filters):
        """Apply filters and re-render"""
        if not self.data:
            return

        testament = filters.get('testament', 'All')
        min_connections = filters.get('min_connections', 1)

        # Filter connections
        filtered_connections = []
        for conn in self.data['connections']:
            if conn['weight'] < min_connections:
                continue

            # Get testament info
            source_ch = next((ch for ch in self.data['chapters'] if ch['id'] == conn['source']), None)
            target_ch = next((ch for ch in self.data['chapters'] if ch['id'] == conn['target']), None)

            if not source_ch or not target_ch:
                continue

            source_testament = source_ch['testament']
            target_testament = target_ch['testament']

            if testament == 'Old Testament' and (source_testament != 'OT' or target_testament != 'OT'):
                continue
            elif testament == 'New Testament' and (source_testament != 'NT' or target_testament != 'NT'):
                continue
            elif testament == 'Cross-Testament' and source_testament == target_testament:
                continue

            filtered_connections.append(conn)

        # Update filtered data
        self.filtered_data = {
            'chapters': self.data['chapters'],
            'connections': filtered_connections
        }

        self.render()

    def export(self):
        """Export current view"""
        from PyQt5.QtWidgets import QFileDialog
        filename, _ = QFileDialog.getSaveFileName(
            self,
            'Export Arc Diagram',
            'bible_arc_diagram.png',
            'PNG Files (*.png);;SVG Files (*.svg)'
        )

        if filename:
            self.figure.savefig(filename, facecolor='#1a1a2e', dpi=300)
