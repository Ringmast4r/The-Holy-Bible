"""
Test Plotly HTML generation with include_plotlyjs
"""

import plotly.graph_objects as go
import tempfile
import os

print("Testing Plotly HTML generation...")

# Create simple scatter plot
fig = go.Figure(data=[go.Scatter(x=[1, 2, 3], y=[4, 5, 6])])
fig.update_layout(title="Test Plot")

# Test 1: Generate with include_plotlyjs=True
print("\nTest 1: include_plotlyjs=True")
temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8')
fig.write_html(temp_file.name, include_plotlyjs=True)
temp_file.close()

# Check file size
file_size = os.path.getsize(temp_file.name)
print(f"  File size: {file_size:,} bytes")
print(f"  File path: {temp_file.name}")

# Check if file contains Plotly
with open(temp_file.name, 'r', encoding='utf-8') as f:
    content = f.read()
    has_plotly = 'Plotly' in content or 'plotly' in content
    print(f"  Contains Plotly: {has_plotly}")
    print(f"  First 200 chars: {content[:200]}")

# Cleanup
os.unlink(temp_file.name)

print("\n✓ Test complete")
