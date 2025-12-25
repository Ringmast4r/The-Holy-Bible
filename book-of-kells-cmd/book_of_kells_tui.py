#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Book of Kells Terminal UI
A colorful ASCII art TUI inspired by the illuminated manuscript
Featuring authentic Celtic ASCII art patterns with proper TUI framework
"""

from textual.app import App, ComposeResult
from textual.containers import Container, Vertical, Horizontal
from textual.widgets import Static, Button, Footer, Header
from textual.screen import Screen
from textual.binding import Binding

# Celtic Border Frame
CELTIC_BORDER_TOP = """
     .--..--..--..--..--..--..--..--..--..--..--..--..--..--..--..--.
    / .. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\
    \\ \\/\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ \\/ /
     \\/ /`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'\\/ /
     / /\\.--.                                                .--./ /\\
    / /\\ \\.. \\                                              / .. \\/\\ \\"""

CELTIC_BORDER_SIDE_LEFT = "    \\ \\/\\ \\/ /"
CELTIC_BORDER_SIDE_RIGHT = "\\ \\/\\ \\/ /"

CELTIC_BORDER_BOTTOM = """    / /\\ \\/\\ \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\.. \\/\\ \\/\\ \\
    \\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `'\\ `' /
     `--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'`--'"""

# ASCII Art Content
CELTIC_CROSS_JGS = """
              _..._
            .-|>X<|-.
          _//.|oxo|.\\_
         /xo=._\\X/_.=ox\\
         |<>X<>(_)<>X<>|
         \\xo.='/X\\'=.ox/
           \\_/oxo\\_//
            ';<>X<>;'
             |=====|
             |<>X<>|
             |oxoxo|
             |<>X<>|
            _|oxoxo|_
       jgs.--' ===== '--.
"""

CELTIC_KNOT_PATTERN_1 = """
        /\\  /\\
       /  \\/  \\
      / /\\ \\/\\ \\
      \\ \\/\\ \\/ /
       \\/ /\\/ /
       / /\\/ /\\
      / /\\  /\\ \\
     / /  \\/  \\ \\
     \\ \\  /\\  / /
      \\ \\/  \\/ /
       \\/ /\\/ /
       / /\\/ /\\
      / /\\ \\/\\ \\
      \\ \\/\\ \\/ /
       \\  /\\  /
        \\/  \\/
"""

CELTIC_KNOT_PATTERN_2 = """
         /\\    /\\
        /  \\  /  \\
       / /\\ \\/ /\\ \\
      / /  \\ \\/  \\ \\
     / /   /\\ \\   \\ \\
     \\ \\  / /\\ \\  / /
      \\ \\/ /  \\ \\/ /
       \\/ /    \\/ /
       / /\\    / /\\
      / /\\ \\  / /\\ \\
     / /  \\ \\/ /  \\ \\
     \\ \\   \\ \\/   / /
      \\ \\  /\\ \\  / /
       \\ \\/ /\\ \\/ /
        \\  /  \\  /
         \\/    \\/
"""

CELTIC_BORDER_PATTERN = """
      .--..--..--..--.
     / .. \\.. \\.. \\.. \\
     \\ \\/\\ \\/\\ \\/\\ \\/ /
      \\/ /\\/ /\\/ /\\/ /
      / /\\/ /\\/ /\\/ /\\
     / /\\ \\/\\ \\/\\ \\/\\ \\
     \\ \\/\\ \\/\\ \\/\\ \\/ /
      \\/ /\\/ /\\/ /\\/ /
      / /\\/ /\\/ /\\/ /\\
     / /\\ \\/\\ \\/\\ \\/\\ \\
     \\ \\/\\ \\/\\ \\/\\ \\/ /
      \\/ /\\/ /\\/ /\\/ /
      / /\\/ /\\/ /\\/ /\\
     / /\\ \\/\\ \\/\\ \\/\\ \\
     \\ `'\\ `'\\ `'\\ `' /
      `--'`--'`--'`--'
"""

LARGE_CELTIC_KNOT = """
              /\\/\\
             /  \\ \\
            / /\\ \\ \\
            \\/ /\\/ /
            / /\\/ /\\
           / /\\ \\/\\ \\
          / / /\\ \\ \\ \\
       /\\/ / / /\\ \\ \\ \\/\\
      /  \\/ / /  \\ \\ \\ \\ \\
     / /\\ \\/ /    \\ \\/\\ \\ \\
     \\/ /\\/ /      \\/ /\\/ /
     / /\\/ /\\      / /\\/ /\\
     \\ \\ \\/\\ \\    / /\\ \\/ /
      \\ \\ \\ \\ \\  / / /\\  /
       \\/\\ \\ \\ \\/ / / /\\/
          \\ \\ \\ \\/ / /
           \\ \\/\\ \\/ /
            \\/ /\\/ /
            / /\\/ /\\
            \\ \\ \\/ /
             \\ \\  /
              \\/\\/
"""

ELABORATE_CROSS_1 = """
                 .-------.
                 |(~\\o/~)|
               _.||/\\X/\\||._
            ,-"  || \\ / ||  "-,
          ,'  () ||o X o|| ()  ',
         / ()  ,-|| / \\ ||-,  () \\
        : o  ,'  ||/\\X/\\||  ',  o ;
     .----------._)~   ~(_.----------.
     |\\/)~~(\\/\\   (~\\ /~)   /\\/)~~(\\/|
     |(X () X) >o  >-X-<  o< (X () X)|
     |/\\)__(/\\/  _(_/|\\_)_  \\/\\)__(/\\|
     '----------' )     ( '----------'
        ; o  ',  ||/\\~/\\/||  ,'  o ;
         \\ ()  '-|| \\o/ ||-'  () /
          ',  () |(~\\ /~)| ()  ,'
            '-._ ||/\\X/\\|| _.-'
                '|| \\ / ||'
                 ||  X  ||
                 ||\\(/\\/||
                 ||=)O(=||
                 ||/\\/)||
                 ||  X  ||
                 || / \\ ||
                 ||/\\X/\\||
           jgs   |(_/o\\_)|
                 '._____.'
"""

MASSIVE_WEAVE = """
                       /\\  /\\
                      /  \\/  \\
                     / /\\/ /\\ \\
                     \\ \\/ /\\/ /
                      \\ \\/\\ \\/
                      /\\ \\/\\ \\
                     / /\\/ /\\ \\
                    / / / /\\ \\ \\
               /\\  / / / /\\ \\ \\ \\  /\\
              /  \\/ / / /  \\ \\ \\ \\/  \\
             / /\\/ / / /    \\ \\ \\/ /\\ \\
             \\ \\/ /\\/ /      \\ \\/ /\\/ /
              \\ \\/\\ \\/ /\\  /\\ \\ \\/\\ \\/
              /\\ \\/\\ \\/  \\/  \\/\\ \\/\\ \\
             / /\\/ /\\/ /\\/ /\\/ /\\/ /\\ \\
            / / / /\\/ /\\/ /\\/ /\\/ /\\ \\ \\
       /\\  / / / /\\ \\/\\ \\/\\ \\/\\ \\/\\ \\ \\ \\  /\\
      /  \\/ / / / /\\ \\/\\ \\/\\ \\/\\ \\ \\ \\ \\ \\/  \\
     / /\\/ / / / / /\\/ /\\/ /\\/ /\\ \\ \\ \\ \\/ /\\ \\
     \\ \\/ /\\/ / / / / /\\/ /\\/ /\\ \\ \\ \\ \\/ /\\/ /
      \\ \\/\\ \\/ / / / /\\ \\/\\ \\/\\ \\ \\ \\ \\ \\/\\ \\/
      /\\ \\/\\ \\ \\ \\ \\ \\/\\ \\/\\ \\/ / / / /\\ \\/\\ \\
     / /\\/ /\\ \\ \\ \\ \\/ /\\/ /\\/ / / / / /\\/ /\\ \\
     \\ \\/ /\\ \\ \\ \\ \\/ /\\/ /\\/ /\\/ / / / / /\\/ /
      \\  /\\ \\ \\ \\ \\ \\/\\ \\/\\ \\/\\ \\/ / / / /\\  /
       \\/  \\ \\ \\ \\/\\ \\/\\ \\/\\ \\/\\ \\/ / / /  \\/
            \\ \\ \\/ /\\/ /\\/ /\\/ /\\/ / / /
             \\ \\/ /\\/ /\\/ /\\/ /\\/ /\\/ /
              \\ \\/\\ \\/\\  /\\  /\\ \\/\\ \\/
              /\\ \\/\\ \\ \\/  \\/ /\\ \\/\\ \\
             / /\\/ /\\ \\      / /\\/ /\\ \\
             \\ \\/ /\\ \\ \\    / / / /\\/ /
              \\  /\\ \\ \\ \\  / / / /\\  /
               \\/  \\ \\ \\ \\/ / / /  \\/
                    \\ \\ \\/ / / /
                     \\ \\/ /\\/ /
                      \\ \\/\\ \\/
                      /\\ \\/\\ \\
                     / /\\/ /\\ \\
                     \\ \\/ /\\/ /
                      \\  /\\  /
                       \\/  \\/
"""

class CelticBorderedStatic(Static):
    """A Static widget with Celtic borders"""

    def __init__(self, content: str, title: str = "", **kwargs):
        self.content = content
        self.title = title
        super().__init__(**kwargs)

    def render(self) -> str:
        lines = self.content.strip().split('\n')
        max_width = max(len(line) for line in lines) if lines else 60

        # Build bordered content
        result = []
        result.append("     " + ".--.." * 16)
        result.append("    / " + "\.. \\" * 16)
        result.append("    \\ " + "\\/\\ " * 15 + "\\/ /")
        result.append("     " + "\\/ /" + "\\/ /" * 14 + "\\/ /")

        if self.title:
            result.append(f"     / /\\ {self.title:^{max_width}} / /\\")

        for line in lines:
            result.append(f"     {line}")

        result.append("    \\ " + "\\/\\ " * 15 + "\\/ /")
        result.append("     " + "`--'" * 16)

        return '\n'.join(result)


class MainScreen(Screen):
    """Main menu screen"""

    BINDINGS = [
        Binding("1", "show_cross", "Celtic Cross"),
        Binding("2", "show_knots", "Celtic Knots"),
        Binding("3", "show_border", "Border Design"),
        Binding("4", "show_elaborate", "Elaborate Cross"),
        Binding("5", "show_large", "Large Knotwork"),
        Binding("6", "show_massive", "Massive Weave"),
        Binding("q", "quit", "Exit"),
    ]

    def compose(self) -> ComposeResult:
        yield Header(show_clock=True)

        title = Static("""
[bold gold1]╔═══════════════════════════════════════════════════════════════════╗[/]
[bold gold1]║ ※ ◊ ※ ◊ ※ ◊ ※ ◊ ※     THE BOOK OF KELLS     ◊ ※ ◊ ※ ◊ ※ ◊ ※  ║[/]
[bold gold1]║              Terminal UI - Celtic Art Gallery                     ║[/]
[bold gold1]╚═══════════════════════════════════════════════════════════════════╝[/]

[yellow]IN PRINCIPIO ERAT VERBVM[/]
        """, id="title")
        yield title

        menu = Static("""
[cyan]Press a number key to view Celtic patterns:[/]

  [gold1]1[/] - [bright_cyan]Celtic Cross (Joan Stark)[/]
  [gold1]2[/] - [bright_green]Celtic Knot Patterns[/]
  [gold1]3[/] - [bright_magenta]Celtic Border Design[/]
  [gold1]4[/] - [bright_yellow]Elaborate Celtic Cross[/]
  [gold1]5[/] - [cyan]Large Celtic Knotwork[/]
  [gold1]6[/] - [white]Massive Celtic Weave[/]

  [gold1]Q[/] - [bright_red]Exit[/]

[dim]※ Beannachtaí (Blessings) ※[/]
        """, id="menu")
        yield menu

        yield Footer()

    def action_show_cross(self) -> None:
        self.app.push_screen(CelticCrossScreen())

    def action_show_knots(self) -> None:
        self.app.push_screen(KnotPatternsScreen())

    def action_show_border(self) -> None:
        self.app.push_screen(BorderDesignScreen())

    def action_show_elaborate(self) -> None:
        self.app.push_screen(ElaborateCrossScreen())

    def action_show_large(self) -> None:
        self.app.push_screen(LargeKnotScreen())

    def action_show_massive(self) -> None:
        self.app.push_screen(MassiveWeaveScreen())


class CelticCrossScreen(Screen):
    """Screen showing Celtic Cross"""

    BINDINGS = [
        Binding("escape", "app.pop_screen", "Back"),
        Binding("q", "app.pop_screen", "Back"),
    ]

    def compose(self) -> ComposeResult:
        yield Header()

        content = Static(f"""
[bold gold1]╔═══════════════ CELTIC CROSS (Joan Stark) ══════════════════╗[/]

[bright_cyan]{CELTIC_CROSS_JGS}[/]

[bold gold1]╚═════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return to menu[/]
        """)
        yield content
        yield Footer()


class KnotPatternsScreen(Screen):
    """Screen showing Celtic Knot Patterns"""

    BINDINGS = [
        Binding("escape", "app.pop_screen", "Back"),
        Binding("q", "app.pop_screen", "Back"),
    ]

    def compose(self) -> ComposeResult:
        yield Header()

        content = Static(f"""
[bold gold1]╔═══════════════ CELTIC KNOT PATTERNS ════════════════════════╗[/]

[bright_green]Pattern 1 - Basic Interlaced Knot:[/]
[bright_green]{CELTIC_KNOT_PATTERN_1}[/]

[bright_green]Pattern 2 - Extended Weave:[/]
[bright_green]{CELTIC_KNOT_PATTERN_2}[/]

[bold gold1]╚══════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return to menu[/]
        """)
        yield content
        yield Footer()


class BorderDesignScreen(Screen):
    """Screen showing Celtic Border Design"""

    BINDINGS = [
        Binding("escape", "app.pop_screen", "Back"),
        Binding("q", "app.pop_screen", "Back"),
    ]

    def compose(self) -> ComposeResult:
        yield Header()

        content = Static(f"""
[bold gold1]╔═════════════ CELTIC BORDER PATTERN ════════════════════════╗[/]

[bright_magenta]{CELTIC_BORDER_PATTERN}[/]

[bold gold1]╚═════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return to menu[/]
        """)
        yield content
        yield Footer()


class ElaborateCrossScreen(Screen):
    """Screen showing Elaborate Celtic Cross"""

    BINDINGS = [
        Binding("escape", "app.pop_screen", "Back"),
        Binding("q", "app.pop_screen", "Back"),
    ]

    def compose(self) -> ComposeResult:
        yield Header()

        content = Static(f"""
[bold gold1]╔═══════════ ELABORATE CELTIC CROSS ═════════════════════════╗[/]

[bright_yellow]{ELABORATE_CROSS_1}[/]

[bold gold1]╚═════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return to menu[/]
        """)
        yield content
        yield Footer()


class LargeKnotScreen(Screen):
    """Screen showing Large Celtic Knotwork"""

    BINDINGS = [
        Binding("escape", "app.pop_screen", "Back"),
        Binding("q", "app.pop_screen", "Back"),
    ]

    def compose(self) -> ComposeResult:
        yield Header()

        content = Static(f"""
[bold gold1]╔═════════════ LARGE CELTIC KNOTWORK ════════════════════════╗[/]

[cyan]{LARGE_CELTIC_KNOT}[/]

[bold gold1]╚═════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return to menu[/]
        """)
        yield content
        yield Footer()


class MassiveWeaveScreen(Screen):
    """Screen showing Massive Celtic Weave"""

    BINDINGS = [
        Binding("escape", "app.pop_screen", "Back"),
        Binding("q", "app.pop_screen", "Back"),
    ]

    def compose(self) -> ComposeResult:
        yield Header()

        content = Static(f"""
[bold gold1]╔═════════════ MASSIVE CELTIC WEAVE ═════════════════════════╗[/]

[white]{MASSIVE_WEAVE}[/]

[bold gold1]╚═════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return to menu[/]
        """)
        yield content
        yield Footer()


class BookOfKellsApp(App):
    """The Book of Kells TUI Application"""

    CSS = """
    Screen {
        background: $surface;
    }

    #title {
        dock: top;
        height: auto;
        content-align: center middle;
        padding: 1;
    }

    #menu {
        height: auto;
        content-align: center middle;
        padding: 2;
    }

    Static {
        height: auto;
        width: 100%;
        content-align: center top;
        overflow-y: auto;
    }

    Footer {
        dock: bottom;
    }

    Header {
        dock: top;
    }
    """

    TITLE = "The Book of Kells - Terminal UI"
    SUB_TITLE = "Celtic Art Gallery"

    def on_mount(self) -> None:
        self.push_screen(MainScreen())


if __name__ == "__main__":
    app = BookOfKellsApp()
    app.run()
