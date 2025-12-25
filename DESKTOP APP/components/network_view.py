"""
3D Network Graph Visualization using Plotly
Interactive force-directed graph of Bible cross-references
"""

from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QUrl
import plotly.graph_objects as go
import networkx as nx
import numpy as np
from pathlib import Path
import tempfile


class NetworkView(QWidget):
    """3D Network graph visualization component"""

    def __init__(self):
        super().__init__()
        self.data = None
        self.graph = None
        self.init_ui()

    def init_ui(self):
        """Initialize UI"""
        layout = QVBoxLayout()
        self.setLayout(layout)

        # Web view for Plotly
        self.web_view = QWebEngineView()
        layout.addWidget(self.web_view)

        # Placeholder
        self.show_placeholder()

    def show_placeholder(self):
        """Show loading placeholder"""
        html = """
        <html>
        <head>
            <style>
                body {
                    background: #1a1a2e;
                    color: #FFD700;
                    font-family: Arial;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .message {
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="message">
                <h1>3D Network Graph</h1>
                <p>Loading data...</p>
            </div>
        </body>
        </html>
        """
        self.web_view.setHtml(html)

    def set_data(self, data):
        """Set data and build graph"""
        self.data = data
        self.build_graph()
        self.render()

    def build_graph(self):
        """Build NetworkX graph from data"""
        self.graph = nx.Graph()

        # PERFORMANCE: Limit to top 500 connections to prevent freezing
        # Full dataset has 190K+ connections which is too slow for 3D layout
        connections = sorted(
            self.data['connections'],
            key=lambda x: x['weight'],
            reverse=True
        )[:500]  # Top 500 most-connected chapters

        # Get unique chapter IDs from top connections
        chapter_ids = set()
        for conn in connections:
            chapter_ids.add(conn['source'])
            chapter_ids.add(conn['target'])

        # Add only referenced chapters as nodes
        for chapter in self.data['chapters']:
            if chapter['id'] in chapter_ids:
                self.graph.add_node(
                    chapter['id'],
                    book=chapter['book'],
                    chapter_num=chapter['chapter'],
                    testament=chapter['testament']
                )

        # Add top connections as edges
        for conn in connections:
            self.graph.add_edge(
                conn['source'],
                conn['target'],
                weight=conn['weight']
            )

    def render(self, filters=None):
        """Render 3D network graph"""
        if not self.graph:
            return

        # Apply filters if provided
        graph = self.graph.copy()
        if filters:
            graph = self.filter_graph(graph, filters)

        # Calculate 3D spring layout
        pos = nx.spring_layout(graph, dim=3, k=0.5, iterations=50)

        # Extract coordinates
        node_x = []
        node_y = []
        node_z = []
        node_text = []
        node_colors = []

        for node in graph.nodes():
            x, y, z = pos[node]
            node_x.append(x)
            node_y.append(y)
            node_z.append(z)

            # Node info
            node_data = graph.nodes[node]
            book = node_data['book']
            chapter = node_data['chapter_num']
            testament = node_data['testament']

            node_text.append(f"{book} {chapter}<br>Testament: {testament}<br>Connections: {graph.degree(node)}")

            # Color by testament
            if testament == 'OT':
                node_colors.append('#2ecc71')
            else:
                node_colors.append('#00CED1')

        # Create edges
        edge_x = []
        edge_y = []
        edge_z = []

        for edge in graph.edges():
            x0, y0, z0 = pos[edge[0]]
            x1, y1, z1 = pos[edge[1]]
            edge_x.extend([x0, x1, None])
            edge_y.extend([y0, y1, None])
            edge_z.extend([z0, z1, None])

        # Create edge trace
        edge_trace = go.Scatter3d(
            x=edge_x, y=edge_y, z=edge_z,
            mode='lines',
            line=dict(color='rgba(125, 125, 125, 0.3)', width=1),
            hoverinfo='none',
            name='Connections'
        )

        # Create node trace
        node_trace = go.Scatter3d(
            x=node_x, y=node_y, z=node_z,
            mode='markers',
            marker=dict(
                size=5,
                color=node_colors,
                line=dict(color='#FFD700', width=0.5),
                opacity=0.8
            ),
            text=node_text,
            hoverinfo='text',
            name='Chapters'
        )

        # Create figure
        fig = go.Figure(data=[edge_trace, node_trace])

        fig.update_layout(
            title=dict(
                text='Bible Cross-Reference Network (3D)',
                font=dict(color='#FFD700', size=20)
            ),
            showlegend=True,
            scene=dict(
                xaxis=dict(showbackground=False, showticklabels=False, title=''),
                yaxis=dict(showbackground=False, showticklabels=False, title=''),
                zaxis=dict(showbackground=False, showticklabels=False, title=''),
                bgcolor='#1a1a2e'
            ),
            paper_bgcolor='#1a1a2e',
            plot_bgcolor='#1a1a2e',
            font=dict(color='#00CED1'),
            hovermode='closest',
            margin=dict(l=0, r=0, t=40, b=0)
        )

        # Save to temp file and load
        # IMPORTANT: include_plotlyjs=True embeds full Plotly.js library (no CDN needed)
        temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8')
        fig.write_html(temp_file.name, include_plotlyjs=True)
        temp_file.close()

        self.web_view.setUrl(QUrl.fromLocalFile(temp_file.name))

    def filter_graph(self, graph, filters):
        """Apply filters to graph"""
        filtered = graph.copy()

        testament = filters.get('testament', 'All')
        min_connections = filters.get('min_connections', 1)

        # Filter by testament
        if testament != 'All':
            nodes_to_remove = []
            for node in filtered.nodes():
                node_testament = filtered.nodes[node]['testament']

                if testament == 'Old Testament' and node_testament != 'OT':
                    nodes_to_remove.append(node)
                elif testament == 'New Testament' and node_testament != 'NT':
                    nodes_to_remove.append(node)
                elif testament == 'Cross-Testament':
                    # Keep nodes that have cross-testament connections
                    neighbors = list(filtered.neighbors(node))
                    has_cross = any(
                        filtered.nodes[n]['testament'] != node_testament
                        for n in neighbors
                    )
                    if not has_cross:
                        nodes_to_remove.append(node)

            filtered.remove_nodes_from(nodes_to_remove)

        # Filter by minimum connections
        nodes_to_remove = [
            node for node in filtered.nodes()
            if filtered.degree(node) < min_connections
        ]
        filtered.remove_nodes_from(nodes_to_remove)

        return filtered

    def apply_filters(self, filters):
        """Apply filters and re-render"""
        self.render(filters)

    def export(self):
        """Export current view"""
        if not self.graph:
            return

        # Export as HTML
        from PyQt5.QtWidgets import QFileDialog
        filename, _ = QFileDialog.getSaveFileName(
            self,
            'Export Network Graph',
            'bible_network_3d.html',
            'HTML Files (*.html)'
        )

        if filename:
            # Re-render and save
            pos = nx.spring_layout(self.graph, dim=3, k=0.5, iterations=50)

            # Create figure (same as render method)
            # ... (code similar to render method)

            # Save
            # fig.write_html(filename)
            pass
