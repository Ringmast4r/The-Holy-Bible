#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CELTIC HERALDRY ULTIMATE
Blending the Book of Kells Celtic Art with Irish Heraldry Search Tool
A comprehensive TUI featuring authentic Celtic ASCII art and heraldic records
"""

from textual.app import App, ComposeResult
from textual.containers import Container, Horizontal, ScrollableContainer
from textual.widgets import Header, Footer, Input, Static
from textual.binding import Binding
from textual.screen import Screen
import sys
import os

# Add the COA-CMD-Tool directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'COA-CMD-Tool'))

# Import heraldry database
try:
    from heraldry_database_real import IRISH_HERALDRY
    from coat_of_arms_art_real import COAT_OF_ARMS_ART, SHAMROCK, CELTIC_CROSS_SMALL
except ImportError:
    IRISH_HERALDRY = {}
    COAT_OF_ARMS_ART = {}
    SHAMROCK = "<!-- Shamrock art not found -->"
    CELTIC_CROSS_SMALL = "<!-- Celtic cross art not found -->"

# ============================================================================
# CELTIC ASCII ART from Book of Kells
# ============================================================================

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

# Psalm 84 - Line by line with proper formatting
PSALM_84_LINES = [
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

# Celtic border patterns for Psalm 84
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


def create_psalm_84_display():
    """Create Psalm 84 with Celtic borders"""
    import re
    result = []

    # Top frame
    result.append("     /" + "-" * 75 + "\\")

    # Add each line with borders
    for i, line in enumerate(PSALM_84_LINES):
        left_idx = i % len(CELTIC_BORDER_LEFT)
        right_idx = i % len(CELTIC_BORDER_RIGHT)

        left_border = CELTIC_BORDER_LEFT[left_idx]
        right_border = CELTIC_BORDER_RIGHT[right_idx]

        # Calculate padding (strip markup for length)
        plain_line = re.sub(r'\[/?[^\]]+\]', '', line)
        padding = 65 - len(plain_line)

        result.append(f"[green]{left_border}[/green]  {line}{' ' * padding}  [green]{right_border}[/green]")

    # Bottom frame
    result.append("     \\" + "-" * 75 + "/")

    return '\n'.join(result)

# ============================================================================
# MAIN MENU SCREEN
# ============================================================================

class MainMenuScreen(Screen):
    """Main menu for the Celtic Heraldry Ultimate app"""

    BINDINGS = [
        Binding("1", "heraldry_search", "Heraldry Search"),
        Binding("2", "celtic_gallery", "Celtic Gallery"),
        Binding("3", "psalm_display", "Psalm 84"),
        Binding("4", "irish_symbols", "Irish Symbols"),
        Binding("q", "quit", "Exit"),
    ]

    def compose(self) -> ComposeResult:
        yield Header(show_clock=True)

        title = Static("""
[bold gold1]╔═══════════════════════════════════════════════════════════════════╗[/]
[bold gold1]║ ※ ◊ ※ ◊ ※     CELTIC HERALDRY ULTIMATE     ◊ ※ ◊ ※ ◊ ※ ◊ ※     ║[/]
[bold gold1]║      The Book of Kells meets Irish Heraldic Arts                 ║[/]
[bold gold1]╚═══════════════════════════════════════════════════════════════════╝[/]

[bright_cyan]IN PRINCIPIO ERAT VERBVM[/]

[green]""" + CELTIC_KNOT_PATTERN_1 + """[/]

[cyan]Select an option:[/]

  [gold1]1[/] - [bright_cyan]Irish Heraldry Search[/] - Search 622 authentic coat of arms
  [gold1]2[/] - [bright_green]Celtic Art Gallery[/] - View beautiful Celtic knots and crosses
  [gold1]3[/] - [bright_yellow]Psalm 84 Display[/] - Sacred text with Celtic borders
  [gold1]4[/] - [bright_magenta]Irish Symbols[/] - Shamrocks and Celtic crosses

  [gold1]Q[/] - [bright_red]Exit[/]

[dim]※ Beannachtaí (Blessings) ※[/]
        """, id="main-menu")
        yield title
        yield Footer()

    def action_heraldry_search(self) -> None:
        self.app.push_screen(HeraldrySearchScreen())

    def action_celtic_gallery(self) -> None:
        self.app.push_screen(CelticGalleryMenuScreen())

    def action_psalm_display(self) -> None:
        self.app.push_screen(Psalm84Screen())

    def action_irish_symbols(self) -> None:
        self.app.push_screen(IrishSymbolsScreen())


# ============================================================================
# HERALDRY SEARCH SCREEN
# ============================================================================

class CoatOfArmsDisplay(Static):
    """Display area for coat of arms and details"""

    def update_welcome(self) -> None:
        """Display welcome screen"""
        welcome = f"""
[green]{CELTIC_CROSS_SMALL}[/]

[bold cyan]Welcome to the Irish Heraldry Search Tool![/]

[yellow]• Search for your Irish surname
• Browse 622 authentic heraldic entries
• View coat of arms ASCII art
• Explore family mottos and origins[/]

[dim]Start typing in the search box above.[/]
"""
        self.update(welcome)

    def update_coat_of_arms(self, key: str) -> None:
        """Display coat of arms for the given key"""
        data = IRISH_HERALDRY.get(key)
        if not data:
            self.update("[red]Entry not found[/]")
            return

        # Get ASCII art if available
        raw_art = COAT_OF_ARMS_ART.get(key, None)
        if raw_art:
            # Clean ANSI codes
            art_clean = raw_art.replace('\033[91m', '').replace('\033[0m', '').replace('\033[92m', '')
            art_display = f"[white]{art_clean}[/white]"
        else:
            art_display = "[dim]ASCII art not yet digitized for this entry[/]"

        motto_text = data.get('motto', 'No motto recorded')
        motto_trans = data.get('motto_translation', 'Translation research needed')

        display = f"""[bold yellow]═══ THE NOBLE HOUSE OF {data['surname'].upper()} ═══[/]

{art_display}

[cyan]╔══════════════════════════════════════════════════════════════╗[/]
[cyan]║[/] [yellow]Motto Information[/] [cyan]                                            ║[/]
[cyan]╚══════════════════════════════════════════════════════════════╝[/]

[yellow]Motto:[/] [white]{motto_text}[/white]

[yellow]Language:[/] {data.get('motto_language', 'Translation research needed')}

[yellow]Translation:[/] [white]{motto_trans}[/white]

[cyan]╔══════════════════════════════════════════════════════════════╗[/]
[cyan]║[/] [magenta]Guild Reference[/] [cyan]                                             ║[/]
[cyan]╚══════════════════════════════════════════════════════════════╝[/]

[white]Crest Code:[/] {data['crest_code']}
[white]Page Number:[/] {data['page']}
"""

        if data.get('origin'):
            display += f"[white]Origin:[/] {data['origin']}\n"

        self.update(display)


class HeraldrySearchScreen(Screen):
    """Irish Heraldry Search interface"""

    BINDINGS = [
        Binding("escape", "app.pop_screen", "Back"),
        Binding("q", "app.pop_screen", "Back"),
    ]

    CSS = """
    #search-input {
        margin: 1 2;
    }

    #display-area {
        height: 1fr;
        margin: 0 2 1 2;
        padding: 1;
        background: $panel;
        border: solid $primary;
        overflow-y: auto;
    }
    """

    def compose(self) -> ComposeResult:
        yield Header()

        yield Static("""
[bold gold1]╔═══════════════════════════════════════════════════════════════╗[/]
[bold gold1]║           IRISH HERALDRY SEARCH - 622 Entries                 ║[/]
[bold gold1]╚═══════════════════════════════════════════════════════════════╝[/]
""")

        yield Input(placeholder="Search for Irish surname (e.g., O'Brien, Kennedy, Burke)...", id="search-input")

        with ScrollableContainer(id="display-area"):
            yield CoatOfArmsDisplay(id="coat-display")

        yield Footer()

    def on_mount(self) -> None:
        """Initialize the screen"""
        display = self.query_one("#coat-display", CoatOfArmsDisplay)
        display.update_welcome()
        self.query_one("#search-input", Input).focus()

    def on_input_changed(self, event: Input.Changed) -> None:
        """Handle search input changes"""
        if event.input.id != "search-input":
            return

        search_term = event.value.strip().upper()

        if not search_term:
            display = self.query_one("#coat-display", CoatOfArmsDisplay)
            display.update_welcome()
            return

        # Search for matching surname
        matches = []
        for key, data in IRISH_HERALDRY.items():
            surname = data['surname'].upper().replace("'", "").replace(" ", "")
            # Normalize Mc/Mac
            if surname.startswith("MAC") and len(surname) > 3:
                surname = "MC" + surname[3:]

            search_normalized = search_term.replace("'", "").replace(" ", "")
            if search_normalized.startswith("MAC") and len(search_normalized) > 3:
                search_normalized = "MC" + search_normalized[3:]

            if surname == search_normalized:
                matches.append(key)

        if matches:
            display = self.query_one("#coat-display", CoatOfArmsDisplay)
            display.update_coat_of_arms(matches[0])


# ============================================================================
# CELTIC GALLERY SCREENS
# ============================================================================

class CelticGalleryMenuScreen(Screen):
    """Menu for Celtic art gallery"""

    BINDINGS = [
        Binding("1", "show_cross", "Celtic Cross"),
        Binding("2", "show_knots", "Knot Patterns"),
        Binding("3", "show_border", "Border Design"),
        Binding("4", "show_elaborate", "Elaborate Cross"),
        Binding("5", "show_large", "Large Knotwork"),
        Binding("6", "show_massive", "Massive Weave"),
        Binding("escape", "app.pop_screen", "Back"),
        Binding("q", "app.pop_screen", "Back"),
    ]

    def compose(self) -> ComposeResult:
        yield Header()

        content = Static("""
[bold gold1]╔═══════════════════════════════════════════════════════════════╗[/]
[bold gold1]║               CELTIC ART GALLERY - Book of Kells              ║[/]
[bold gold1]╚═══════════════════════════════════════════════════════════════╝[/]

[cyan]Select a Celtic pattern to view:[/]

  [gold1]1[/] - [bright_cyan]Celtic Cross (Joan Stark)[/]
  [gold1]2[/] - [bright_green]Celtic Knot Patterns[/]
  [gold1]3[/] - [bright_magenta]Celtic Border Design[/]
  [gold1]4[/] - [bright_yellow]Elaborate Celtic Cross[/]
  [gold1]5[/] - [cyan]Large Celtic Knotwork[/]
  [gold1]6[/] - [white]Massive Celtic Weave[/]

  [gold1]ESC[/] - [bright_red]Back to Main Menu[/]

[dim]※ Each pattern hand-crafted in ASCII art ※[/]
        """)
        yield content
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
    BINDINGS = [Binding("escape", "app.pop_screen", "Back"), Binding("q", "app.pop_screen", "Back")]

    def compose(self) -> ComposeResult:
        yield Header()
        content = Static(f"""
[bold gold1]╔═══════════════ CELTIC CROSS (Joan Stark) ══════════════════╗[/]

[bright_cyan]{CELTIC_CROSS_JGS}[/]

[bold gold1]╚═════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return[/]
        """)
        yield content
        yield Footer()


class KnotPatternsScreen(Screen):
    BINDINGS = [Binding("escape", "app.pop_screen", "Back"), Binding("q", "app.pop_screen", "Back")]

    def compose(self) -> ComposeResult:
        yield Header()
        content = Static(f"""
[bold gold1]╔═══════════════ CELTIC KNOT PATTERNS ════════════════════════╗[/]

[bright_green]Pattern 1 - Basic Interlaced Knot:[/]
[bright_green]{CELTIC_KNOT_PATTERN_1}[/]

[bright_green]Pattern 2 - Extended Weave:[/]
[bright_green]{CELTIC_KNOT_PATTERN_2}[/]

[bold gold1]╚══════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return[/]
        """)
        yield content
        yield Footer()


class BorderDesignScreen(Screen):
    BINDINGS = [Binding("escape", "app.pop_screen", "Back"), Binding("q", "app.pop_screen", "Back")]

    def compose(self) -> ComposeResult:
        yield Header()
        content = Static(f"""
[bold gold1]╔═════════════ CELTIC BORDER PATTERN ════════════════════════╗[/]

[bright_magenta]{CELTIC_BORDER_PATTERN}[/]

[bold gold1]╚═════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return[/]
        """)
        yield content
        yield Footer()


class ElaborateCrossScreen(Screen):
    BINDINGS = [Binding("escape", "app.pop_screen", "Back"), Binding("q", "app.pop_screen", "Back")]

    def compose(self) -> ComposeResult:
        yield Header()
        content = Static(f"""
[bold gold1]╔═══════════ ELABORATE CELTIC CROSS ═════════════════════════╗[/]

[bright_yellow]{ELABORATE_CROSS_1}[/]

[bold gold1]╚═════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return[/]
        """)
        yield content
        yield Footer()


class LargeKnotScreen(Screen):
    BINDINGS = [Binding("escape", "app.pop_screen", "Back"), Binding("q", "app.pop_screen", "Back")]

    def compose(self) -> ComposeResult:
        yield Header()
        content = Static(f"""
[bold gold1]╔═════════════ LARGE CELTIC KNOTWORK ════════════════════════╗[/]

[cyan]{LARGE_CELTIC_KNOT}[/]

[bold gold1]╚═════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return[/]
        """)
        yield content
        yield Footer()


class MassiveWeaveScreen(Screen):
    BINDINGS = [Binding("escape", "app.pop_screen", "Back"), Binding("q", "app.pop_screen", "Back")]

    def compose(self) -> ComposeResult:
        yield Header()
        content = Static(f"""
[bold gold1]╔═════════════ MASSIVE CELTIC WEAVE ═════════════════════════╗[/]

[white]{MASSIVE_WEAVE}[/]

[bold gold1]╚═════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return[/]
        """)
        yield content
        yield Footer()


# ============================================================================
# PSALM 84 SCREEN
# ============================================================================

class Psalm84Screen(Screen):
    """Display Psalm 84 with Celtic borders"""

    BINDINGS = [
        Binding("escape", "app.pop_screen", "Back"),
        Binding("q", "app.pop_screen", "Back"),
    ]

    def compose(self) -> ComposeResult:
        yield Header()

        # Create the psalm display with Celtic borders
        psalm_display = create_psalm_84_display()

        content = f"""
[bold gold1]╔═════════════════ PSALM 84 ══════════════════════════════════╗[/]

{psalm_display}

[bold gold1]╚══════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return to menu[/]
        """

        yield Static(content, id="psalm-content")
        yield Footer()


# ============================================================================
# IRISH SYMBOLS SCREEN
# ============================================================================

class IrishSymbolsScreen(Screen):
    """Display shamrock and other Irish symbols"""

    BINDINGS = [
        Binding("escape", "app.pop_screen", "Back"),
        Binding("q", "app.pop_screen", "Back"),
    ]

    def compose(self) -> ComposeResult:
        yield Header()

        # Clean ANSI codes from shamrock and cross
        shamrock_clean = str(SHAMROCK).replace('\033[91m', '').replace('\033[0m', '').replace('\033[92m', '')
        cross_clean = str(CELTIC_CROSS_SMALL).replace('\033[91m', '').replace('\033[0m', '').replace('\033[92m', '')

        content = f"""
[bold gold1]╔═════════════════ IRISH SYMBOLS ══════════════════════════════╗[/]

[bold green]The Shamrock - Symbol of Ireland[/]
[green]{shamrock_clean}[/]

[bold green]Celtic Cross - Faith and Heritage[/]
[green]{cross_clean}[/]

[bold gold1]╚═══════════════════════════════════════════════════════════════╝[/]

[dim]Press ESC or Q to return to menu[/]
        """

        yield Static(content)
        yield Footer()


# ============================================================================
# MAIN APPLICATION
# ============================================================================

class CelticHeraldryUltimateApp(App):
    """Celtic Heraldry Ultimate - Combined TUI Application"""

    CSS = """
    Screen {
        background: $surface;
    }

    Static {
        height: auto;
        width: 100%;
        content-align: center top;
        overflow-y: auto;
        padding: 1;
    }

    #main-menu {
        padding: 2;
    }

    Footer {
        dock: bottom;
    }

    Header {
        dock: top;
    }
    """

    TITLE = "Celtic Heraldry Ultimate"
    SUB_TITLE = "Book of Kells ※ Irish Heraldry"

    BINDINGS = [
        Binding("q", "quit", "Quit", priority=True),
    ]

    def on_mount(self) -> None:
        self.push_screen(MainMenuScreen())


if __name__ == "__main__":
    app = CelticHeraldryUltimateApp()
    app.run()
