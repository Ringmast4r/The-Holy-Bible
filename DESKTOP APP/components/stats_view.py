"""
Statistics Dashboard
Shows key metrics and insights about cross-references
"""

from PyQt5.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel,
                             QScrollArea, QFrame, QGridLayout)
from PyQt5.QtCore import Qt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import matplotlib.pyplot as plt


class StatsView(QWidget):
    """Statistics dashboard component"""

    def __init__(self):
        super().__init__()
        self.stats = None
        self.init_ui()

    def init_ui(self):
        """Initialize UI"""
        layout = QVBoxLayout()
        self.setLayout(layout)

        # Scroll area for stats
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("QScrollArea { border: none; background: #1a1a2e; }")

        # Container widget
        container = QWidget()
        container_layout = QVBoxLayout()
        container.setLayout(container_layout)

        # Title
        title = QLabel('Cross-Reference Statistics')
        title.setStyleSheet('color: #FFD700; font-size: 18pt; font-weight: bold; padding: 10px;')
        title.setAlignment(Qt.AlignCenter)
        container_layout.addWidget(title)

        # Stats grid
        self.stats_grid = QGridLayout()
        container_layout.addLayout(self.stats_grid)

        # Charts area (responsive size)
        self.figure = Figure(facecolor='#1a1a2e')
        self.canvas = FigureCanvas(self.figure)
        self.canvas.setSizePolicy(
            self.canvas.sizePolicy().horizontalPolicy(),
            self.canvas.sizePolicy().verticalPolicy()
        )
        container_layout.addWidget(self.canvas)

        scroll.setWidget(container)
        layout.addWidget(scroll)

        plt.style.use('dark_background')

    def set_data(self, stats):
        """Set statistics data"""
        self.stats = stats
        self.render()

    def render(self):
        """Render statistics"""
        if not self.stats:
            return

        # Clear previous stats
        for i in reversed(range(self.stats_grid.count())):
            self.stats_grid.itemAt(i).widget().setParent(None)

        # Add stat cards
        stat_items = [
            ('Total Connections', self.stats.get('total_connections', 0), '#FFD700'),
            ('Total Chapters', self.stats.get('total_chapters', 0), '#00CED1'),
            ('Total Books', 66, '#2ecc71'),
            ('Avg Connections/Chapter', self.stats.get('avg_connections_per_chapter', 0), '#9370DB'),
        ]

        for i, (label, value, color) in enumerate(stat_items):
            card = self.create_stat_card(label, value, color)
            self.stats_grid.addWidget(card, 0, i)

        # Render charts
        self.render_charts()

    def create_stat_card(self, label, value, color):
        """Create a stat card widget"""
        card = QFrame()
        card.setStyleSheet(f"""
            QFrame {{
                background: #16213e;
                border: 2px solid {color};
                border-radius: 10px;
                padding: 15px;
            }}
        """)

        layout = QVBoxLayout()
        card.setLayout(layout)

        value_label = QLabel(str(value))
        value_label.setStyleSheet(f'color: {color}; font-size: 24pt; font-weight: bold;')
        value_label.setAlignment(Qt.AlignCenter)

        text_label = QLabel(label)
        text_label.setStyleSheet('color: #00CED1; font-size: 10pt;')
        text_label.setAlignment(Qt.AlignCenter)

        layout.addWidget(value_label)
        layout.addWidget(text_label)

        return card

    def render_charts(self):
        """Render statistical charts"""
        if not self.stats:
            return

        self.figure.clear()

        # Top books by connections
        ax1 = self.figure.add_subplot(2, 2, 1)
        ax1.set_facecolor('#1a1a2e')

        if 'top_books' in self.stats:
            top_books = self.stats['top_books'][:10]
            books = [b['book'] for b in top_books]
            counts = [b['connections'] for b in top_books]

            bars = ax1.barh(books, counts, color='#FFD700', edgecolor='#00CED1')
            ax1.set_xlabel('Total Connections', color='#00CED1')
            ax1.set_title('Top 10 Books by Connections', color='#FFD700', fontweight='bold')
            ax1.tick_params(colors='#00CED1')

        # Testament distribution
        ax2 = self.figure.add_subplot(2, 2, 2)
        ax2.set_facecolor('#1a1a2e')

        if 'testament_stats' in self.stats:
            testament_stats = self.stats['testament_stats']
            labels = ['OT-OT', 'NT-NT', 'Cross-Testament']
            sizes = [
                testament_stats.get('OT-OT', 0),
                testament_stats.get('NT-NT', 0),
                testament_stats.get('cross_testament', 0)
            ]
            colors = ['#2ecc71', '#00CED1', '#9370DB']

            ax2.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%',
                   textprops={'color': '#FFD700'})
            ax2.set_title('Connection Distribution by Testament',
                         color='#FFD700', fontweight='bold')

        # Connection weight distribution
        ax3 = self.figure.add_subplot(2, 2, 3)
        ax3.set_facecolor('#1a1a2e')

        if 'weight_distribution' in self.stats:
            weights = list(self.stats['weight_distribution'].keys())
            counts = list(self.stats['weight_distribution'].values())

            ax3.bar(weights[:20], counts[:20], color='#00CED1', edgecolor='#FFD700')
            ax3.set_xlabel('Connection Weight', color='#00CED1')
            ax3.set_ylabel('Frequency', color='#00CED1')
            ax3.set_title('Connection Weight Distribution',
                         color='#FFD700', fontweight='bold')
            ax3.tick_params(colors='#00CED1')

        # Top chapters by connections
        ax4 = self.figure.add_subplot(2, 2, 4)
        ax4.set_facecolor('#1a1a2e')

        if 'top_chapters' in self.stats:
            top_chapters = self.stats['top_chapters'][:10]
            chapters = [f"{c['chapter']}" for c in top_chapters]
            counts = [c['connections'] for c in top_chapters]

            bars = ax4.barh(chapters, counts, color='#9370DB', edgecolor='#FFD700')
            ax4.set_xlabel('Total Connections', color='#00CED1')
            ax4.set_title('Top 10 Chapters by Connections',
                         color='#FFD700', fontweight='bold')
            ax4.tick_params(colors='#00CED1')

        self.figure.tight_layout()
        self.canvas.draw()

    def apply_filters(self, filters):
        """Stats view doesn't use filters"""
        pass

    def export(self):
        """Export current view"""
        from PyQt5.QtWidgets import QFileDialog
        filename, _ = QFileDialog.getSaveFileName(
            self,
            'Export Statistics',
            'bible_stats.png',
            'PNG Files (*.png);;SVG Files (*.svg)'
        )

        if filename:
            self.figure.savefig(filename, facecolor='#1a1a2e', dpi=300)
