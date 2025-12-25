"""
Heatmap Visualization using Matplotlib
66x66 book-to-book connection matrix
"""

from PyQt5.QtWidgets import QWidget, QVBoxLayout
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import numpy as np
import matplotlib.pyplot as plt


class HeatmapView(QWidget):
    """Heatmap visualization component"""

    def __init__(self):
        super().__init__()
        self.data = None
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

        # Set dark background style
        try:
            plt.style.use('dark_background')
        except:
            pass  # Style not critical

    def set_data(self, data):
        """Set data"""
        self.data = data
        self.render()

    def render(self):
        """Render heatmap"""
        if not self.data or 'book_matrix' not in self.data:
            return

        self.figure.clear()
        ax = self.figure.add_subplot(111)
        ax.set_facecolor('#1a1a2e')

        # Extract book matrix (it's just a 2D array in graph_data.json)
        matrix = np.array(self.data['book_matrix'])

        # Get book names from books array
        books = [book['name'] for book in self.data['books']]

        # Create heatmap using matplotlib
        im = ax.imshow(matrix, cmap='YlOrRd', aspect='equal')

        # Add colorbar
        cbar = self.figure.colorbar(im, ax=ax, label='Connection Strength')
        cbar.ax.yaxis.label.set_color('#00CED1')
        cbar.ax.tick_params(colors='#00CED1')

        # Set ticks
        ax.set_xticks(np.arange(len(books)))
        ax.set_yticks(np.arange(len(books)))
        ax.set_xticklabels(books)
        ax.set_yticklabels(books)

        # Styling
        ax.set_title('Bible Book Cross-Reference Heatmap (66x66)',
                     color='#FFD700', fontsize=16, fontweight='bold', pad=20)
        ax.set_xlabel('Target Book', color='#00CED1', fontsize=12)
        ax.set_ylabel('Source Book', color='#00CED1', fontsize=12)

        # Rotate labels
        ax.set_xticklabels(ax.get_xticklabels(), rotation=90, fontsize=6, color='#00CED1')
        ax.set_yticklabels(ax.get_yticklabels(), rotation=0, fontsize=6, color='#00CED1')

        # Add testament dividers
        ot_count = 39
        ax.axhline(y=ot_count, color='#FFD700', linewidth=2)
        ax.axvline(x=ot_count, color='#FFD700', linewidth=2)

        # Add testament labels
        ax.text(ot_count/2, -2, 'Old Testament', ha='center', color='#2ecc71',
                fontsize=10, fontweight='bold')
        ax.text(ot_count + (66-ot_count)/2, -2, 'New Testament', ha='center',
                color='#00CED1', fontsize=10, fontweight='bold')

        self.figure.tight_layout()
        self.canvas.draw()

    def apply_filters(self, filters):
        """Apply filters (heatmap shows all books)"""
        # Heatmap typically shows all books, but we could highlight regions
        self.render()

    def export(self):
        """Export current view"""
        from PyQt5.QtWidgets import QFileDialog
        filename, _ = QFileDialog.getSaveFileName(
            self,
            'Export Heatmap',
            'bible_heatmap.png',
            'PNG Files (*.png);;SVG Files (*.svg)'
        )

        if filename:
            self.figure.savefig(filename, facecolor='#1a1a2e', dpi=300)
