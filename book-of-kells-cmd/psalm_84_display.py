#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Psalm 84 Display with Celtic Borders
Recreating the beautiful Celtic-bordered psalm display exactly as in the image
"""

from textual.app import App, ComposeResult
from textual.widgets import Static, Header, Footer
from textual.binding import Binding
from textual.screen import Screen


# Celtic knot border pattern (repeating segment)
CELTIC_BORDER_LEFT = [
    "   / \\  / \\",
    "  /  \\/  \\",
    " / /\\ \\/\\ \\",
    " \\ \\/\\ \\/ /",
    "  \\/ /\\/ /",
    "  / /\\/ /\\",
    " / /\\  /\\ \\",
    "/ /  \\/  \\ \\",
]

CELTIC_BORDER_RIGHT = [
    "/ \\  / \\",
    " \\  /\\  /",
    " \\ \\/ \\/ /",
    "  \\/ /\\/ ",
    "  / /\\/ /\\",
    " / /\\ \\/\\ \\",
    "/ /  \\/  \\ \\",
    "\\ \\  /\\  / /",
]


# The Psalm 84 text with line-by-line formatting
PSALM_LINES = [
    "[yellow]                                                                  [red]Psalm 84[/red][/yellow]",
    "",
    "",
    "[yellow]    How amiable are thy tabernacles,[/yellow]",
    "[yellow]                         [red]O[/red] LORD of hosts![/yellow]",
    "",
    "[yellow]    My soul longeth, yea, even fainteth for[/yellow]",
    "[yellow]  the courts of the LORD: my heart and my[/yellow]",
    "[yellow]   flesh crieth out for the living God.[/yellow]",
    "",
    "[yellow]    Yea, the sparrow hath found an house, and[/yellow]",
    "[yellow]  the swallow a nest for herself, where she[/yellow]",
    "[yellow]   may lay her young, even thine altars, [red]O[/red][/yellow]",
    "[yellow]    LORD of hosts, my King, and my God.[/yellow]",
    "",
    "[yellow]  [red]B[/red]lessed are they that dwell in thy house:[/yellow]",
    "[yellow]   they will be still praising thee. Selah.[/yellow]",
    "",
    "[yellow][red]B[/red]lessed is the man whose strength is in thee; in whose heart are the[/yellow]",
    "[yellow]ways of them.[/yellow]",
    "",
    "[yellow]Who passing through the valley of Baca make it a well; the rain[/yellow]",
    "[yellow]also filleth the pools.[/yellow]",
    "",
    "[yellow]They go from strength to strength, every one of them in Zion[/yellow]",
    "[yellow]appeareth before God.[/yellow]",
    "",
    "[yellow][red]O[/red] LORD God of hosts, hear my prayer: give ear, [red]O[/red] God of Jacob. Selah.[/yellow]",
    "",
    "[yellow]Behold, [red]O[/red] God our shield, and look upon the face of thine annointed.[/yellow]",
    "",
    "[yellow]For a day in thy courts is better than a thousand. I had rather be a[/yellow]",
    "[yellow]doorkeeper in the house of my God, than to dwell in the tents of[/yellow]",
    "[yellow]wickedness.[/yellow]",
    "",
    "[yellow]For the LORD God is a sun and shield: the LORD will give grace and[/yellow]",
    "[yellow]glory: no good thing will he withold from them that walk uprightly.[/yellow]",
    "",
    "[yellow][red]O[/red] LORD of hosts, blessed is the man that trusteth in thee.[/yellow]",
]


def create_psalm_display():
    """Create the full psalm display with Celtic borders matching the image"""
    result = []

    # Top corner frame
    result.append("     /" + "-" * 75 + "\\")

    # Add each psalm line with borders
    for i, psalm_line in enumerate(PSALM_LINES):
        # Get the border patterns (cycling through the 8-line pattern)
        left_idx = i % len(CELTIC_BORDER_LEFT)
        right_idx = i % len(CELTIC_BORDER_RIGHT)

        left_border = CELTIC_BORDER_LEFT[left_idx]
        right_border = CELTIC_BORDER_RIGHT[right_idx]

        # Strip markup to calculate padding
        import re
        plain_line = re.sub(r'\[/?[^\]]+\]', '', psalm_line)
        padding_needed = 65 - len(plain_line)

        # Combine: [green]left_border[/green] + psalm_line + padding + [green]right_border[/green]
        result.append(f"[green]{left_border}[/green]  {psalm_line}{' ' * padding_needed}  [green]{right_border}[/green]")

    # Bottom corner frame
    result.append("     \\" + "-" * 75 + "/")

    return '\n'.join(result)


class Psalm84Screen(Screen):
    """Display screen for Psalm 84"""

    BINDINGS = [
        Binding("escape", "app.pop_screen", "Back"),
        Binding("q", "quit", "Quit"),
    ]

    def compose(self) -> ComposeResult:
        yield Header()

        # Create the display with all colors embedded
        display_text = create_psalm_display()

        yield Static(display_text, id="psalm-content")
        yield Footer()


class Psalm84App(App):
    """Psalm 84 Display Application"""

    CSS = """
    Screen {
        background: $surface;
    }

    #psalm-content {
        height: auto;
        width: 100%;
        content-align: center top;
        padding: 2;
        overflow-y: auto;
    }

    Static {
        height: auto;
    }
    """

    TITLE = "Psalm 84 - Celtic Display"

    BINDINGS = [
        Binding("q", "quit", "Quit"),
    ]

    def on_mount(self) -> None:
        self.push_screen(Psalm84Screen())


if __name__ == "__main__":
    app = Psalm84App()
    app.run()
