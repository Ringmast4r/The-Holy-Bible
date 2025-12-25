// Main Terminal Controller

class BibleTerminal {
    constructor() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.commandParser = new CommandParser(this);
        this.commandHistory = [];
        this.historyIndex = -1;

        // Theme system
        this.themes = ['professional', 'vibrant', 'matrix', 'sunset', 'royal', 'ocean'];
        this.currentTheme = 'vibrant'; // Default to vibrant (original colors)
        document.documentElement.setAttribute('data-theme', this.currentTheme);

        this.init();
    }

    async init() {
        // Show loading indicator
        this.showLoading();

        try {
            // Load Bible data
            await bibleData.load();

            // Hide loading indicator
            this.hideLoading();

            // Show animated splash screen
            await this.animatedSplash();

            // Show welcome message
            this.showWelcome();

            // Setup event listeners
            this.setupEventListeners();

            // Focus input
            this.input.focus();

        } catch (error) {
            this.hideLoading();
            this.printLine('<span class="error-message">✗ Failed to load Bible data. Please refresh the page.</span>');
            this.printLine(`<span class="gray">Error: ${error.message}</span>`);
        }
    }

    async animatedSplash() {
        // ASCII art splash - Custom Bible Design
        const splashArt = `<span class="cyan">
                          ..::..::::::::::::.::.
                         ..:+=.:*######*#**#::.
                         ..:=:=%-:-+#+::*+:*::.
                          .:=#*.:%=#::-#+:+*::..
                        ...:-#:*--+-**#-=+**.-....
                     ...:::.:#=+:+=+++=-*:+*.=.:-....
                 ....::::=#::#-:#**.:#**.:#*.***=:.-:..
               ...:::-+#+++=.%:+:.+*#-.+*=:*.**+=+*+:::...
              ..:::=*+=====+.#=+:*==+:#==+-+.**++=+=++-:::..
            ..:::=#+====+=.-.*+:***:-#**::*+.+:.++=====+=:::..
           ..::-*+=====.:+#*.=-=*::=*+::*%:+:-.=+::++====+-::..
         ..:.:=*+====.-#+..-::--=***++**+=-=::....=-.=+=+==+:::..
         .-::++===*::#+.. .:::=:--======--::-:..  ..=::+====+::-..
        .:::++====.-#..  ..-:=+-:-=++++=-:.==--:.  ...-:=+===+:::.
        .::=*===+.-*.....-:=-:++=-:-=*+---=+-:+--..   .=:-=====:::
.::::::.-==*++++==%:...::-=:+*==*+**+-=*+=+=:#=:=-:.....--+=====--.::::::.
.:-=---:::::::...:::::::-=-=:=*##-:+*+#:=+#*====:+-:::-----=====+++++++=::
.:=.:=+-:-+-:::=+=:::==:-:=:#:+=-+#-+*:+*#--+#*-=-=:*:.:=+:-::==::.==::=.:
.:+=:+-+=*-+#-+==*==*#:-:+--#+:-***.:+--====-=*:=:--.=+*+-=*===-*+=+-*:+.:
::+*+-+++=-+*=+:=**--*:=:+*-:-##+*+**+*****+++::*=:+:*-=**=:***+:+=*-:*+.:
::*-.#::***-:***--*#-#:+:++:=++=-:.:-+--**=:-+-+==:=:+=%=:+##=:+**+:=+:*.:
::+*.-+#=.=*#=:-**+:=*:--=+:#*-:=**=:#:=++++-:#=-::-.#-:***::*#+-:**+.*+.:
::=+-++--*=*-:***-:#::=:::*:=::#=-+-:**-*+::#+*:-:=:#:=#:=-#+:==**:=+#-=:-
::=..:=#=:.+#-..*#-:-:+-:-:*-:.#*=::*+++::*#+::+:-:-:--:#*-.:+#*:.-#*::-.-
-.:-::::::::::::::::::::.:+:+*:-#*#*-:=+***#==+.-:......::::::::::::::::.-
.:::--==++-=*****-:=----:+.=-.++.::::-+#+-=*-::-.#+:..::--*+=++-:-:::::::.
     ..  .:.==---=.:-.. ..:=:-+:::+#*+=+*::.*::+*... .:::*==-=-.=.
        ..::.+-:-:=-.+.......::.::*%#*#%*::.:.=..  ..-:-+=--==.-:.
         ...:.--:--=+.:+... .:=++%%*+==*%#*::-:. ..:::*+---=-.=-.
           ..:..=:::-=+.:=..:.*+.=*:..:+:.+#.+::.=::#+=-==+:.*-..
            ..:..:=---==+=.:-.*+.+.#=-*:=+.*#=.::-*=----==.-*..
             ...=..:+=--===+#.#*..#*#.:+*#::+=:=+-----=*.:*-..
                ..:-..==---=-:*++-=*:=@-=:*-.+.=-=--=-..*+.
                   ..=:..=+=-:*-#*::+*+::*#*:*.====..=#-.
                      ..=+.:::++:*=#=.#=%-.*=#.-..*#-..
                          ..::+*:-*+++:+*+=.+*.=...
                          ..::+==--*.-#-=::+:=--:
                          ..-:#.+*-.****.:*#--=:-
                           .-:#.=:-%:-*:=%::==*.-
                          ..-:#+:++**:.***+:.**.-.
                          ..-:*:+:=+:==:++--:=*.-.
                          ..:---**-.**++=:=#+-+.-.
                          .::=::*::#:+=--#::+-+:-.
                          .-.*+:-=#**::**+*-.=+:-.
                          .-.#+=:=*+-+=--+=--.*--..
                          .=.#:=#+-:*+**-::**::--..
                          .-:%:++-++:+=-:#-.=-:--:
                          .::#--***#:.:+**++::*=:-.
                          .:-**-:+=+-+::==+---:+.=.
                          ..-*:*+=:.=#*+--::*=:*.+.
                          .:=*.#*:-*:==+-:+-*=-*.+.
                          .:=*:--=*++.:=+#*=.-=*:=.
                         ..:=*+:=+===-+--=+++::+-::
                         .::==:+=-+:.+**+-=.:#:=+.:
                         .::+..#*::*=*==+-.+-*::+.:
                         .-:#..-:+**-.:+:.##-.-*=.-.
                         .-.#*.:*====*-.-*++*=.++:-.
                         .-.#:*::-+=:.+#=-+=:-*.*:=.
                         .::+.***+:.-#**+:.:**+:-.+.
                         .::+...::=#:...-##**+.:=.=.
                         ..:####**++++*++*+++***#.-:.
                         .+*#######################..</span>

<span class="white">
 ██████╗ ██╗██████╗ ██╗     ███████╗     █████╗ ███╗   ██╗ █████╗ ██╗  ██╗   ██╗███████╗██╗███████╗
 ██╔══██╗██║██╔══██╗██║     ██╔════╝    ██╔══██╗████╗  ██║██╔══██╗██║  ╚██╗ ██╔╝██╔════╝██║██╔════╝
 ██████╔╝██║██████╔╝██║     █████╗      ███████║██╔██╗ ██║███████║██║   ╚████╔╝ ███████╗██║███████╗
 ██╔══██╗██║██╔══██╗██║     ██╔══╝      ██╔══██║██║╚██╗██║██╔══██║██║    ╚██╔╝  ╚════██║██║╚════██║
 ██████╔╝██║██████╔╝███████╗███████╗    ██║  ██║██║ ╚████║██║  ██║███████╗██║   ███████║██║███████║
 ╚═════╝ ╚═╝╚═════╝ ╚══════╝╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝╚═╝╚══════╝
                                   ████████╗ ██████╗  ██████╗ ██╗
                                   ╚══██╔══╝██╔═══██╗██╔═══██╗██║
                                      ██║   ██║   ██║██║   ██║██║
                                      ██║   ╚██████╔╝╚██████╔╝███████╗
                                      ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝</span>

<span class="gray">                      Explore 340,000+ Scripture Cross-References
                            4 Bible Translations Available</span>`;

        const lines = splashArt.split('\n');
        let skipAnimation = false;
        let skipListener = null;

        // Function to check for skip (any key press)
        const checkSkip = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                skipAnimation = true;
                e.preventDefault();
            }
        };

        // Add skip listener
        skipListener = (e) => checkSkip(e);
        document.addEventListener('keydown', skipListener);

        // Helper to display pixelated version
        const displayStage = (visibility) => {
            this.output.innerHTML = ''; // Clear output
            for (const line of lines) {
                // Extract HTML tags and preserve them
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = line;
                const text = tempDiv.textContent || tempDiv.innerText || '';

                // Apply pixelation to text content only
                let pixelated = '';
                for (let i = 0; i < text.length; i++) {
                    pixelated += Math.random() < visibility ? text[i] : ' ';
                }

                // Wrap in same HTML tags as original
                const lineDiv = document.createElement('div');
                lineDiv.className = 'output-line';
                lineDiv.innerHTML = line.replace(text, pixelated);
                this.output.appendChild(lineDiv);
            }
        };

        // Stage 1: 20% visible
        displayStage(0.20);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (skipAnimation) {
            document.removeEventListener('keydown', skipListener);
            this.output.innerHTML = '';
            for (const line of lines) {
                this.printLine(line);
            }
            return;
        }

        // Stage 2: 40% visible
        displayStage(0.40);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (skipAnimation) {
            document.removeEventListener('keydown', skipListener);
            this.output.innerHTML = '';
            for (const line of lines) {
                this.printLine(line);
            }
            return;
        }

        // Stage 3: 60% visible
        displayStage(0.60);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (skipAnimation) {
            document.removeEventListener('keydown', skipListener);
            this.output.innerHTML = '';
            for (const line of lines) {
                this.printLine(line);
            }
            return;
        }

        // Stage 4: 80% visible
        displayStage(0.80);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (skipAnimation) {
            document.removeEventListener('keydown', skipListener);
            this.output.innerHTML = '';
            for (const line of lines) {
                this.printLine(line);
            }
            return;
        }

        // Final: 100% visible
        this.output.innerHTML = '';
        for (const line of lines) {
            this.printLine(line);
        }

        // Remove skip listener
        document.removeEventListener('keydown', skipListener);

        if (!skipAnimation) {
            // Pause so users can see the art
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Prompt to continue
            this.printLine('');
            this.printLine('<span class="gray">                    Press Enter to continue...</span>');

            // Wait for Enter key
            await new Promise(resolve => {
                const continueListener = (e) => {
                    if (e.key === 'Enter') {
                        document.removeEventListener('keydown', continueListener);
                        resolve();
                    }
                };
                document.addEventListener('keydown', continueListener);
            });
        }

        // Clear screen for welcome message
        this.output.innerHTML = '';
    }

    setupEventListeners() {
        // Handle enter key
        this.input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const command = this.input.value;
                if (command.trim()) {
                    this.printLine(`<span class="prompt">⊳ Enter your choice:</span> ${command}`);
                    this.commandHistory.push(command);
                    this.historyIndex = this.commandHistory.length;
                    await this.commandParser.execute(command);
                }
                this.input.value = '';
                this.scrollToBottom();
            }
            // Command history navigation
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.input.value = this.commandHistory[this.historyIndex];
                }
            }
            else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    this.input.value = this.commandHistory[this.historyIndex];
                } else {
                    this.historyIndex = this.commandHistory.length;
                    this.input.value = '';
                }
            }
        });

        // Keep input focused
        document.addEventListener('click', () => {
            if (!this.input.disabled) {
                this.input.focus();
            }
        });
    }

    showWelcome() {
        this.printLine('<span class="gold">╔═══════════════════════════════════════════════════════════════════╗</span>');
        this.printLine('<span class="gold">║                                                                   ║</span>');
        this.printLine('<span class="gold">║          <span class="cyan">✟</span>  BIBLE ANALYSIS TOOL - WEB VERSION  <span class="cyan">✟</span>               ║</span>');
        this.printLine('<span class="gold">║                                                                   ║</span>');
        this.printLine('<span class="gold">║         <span class="white">Explore Scripture with Cross-References</span>             ║</span>');
        this.printLine('<span class="gold">║              <span class="gray">Created by <span class="cyan">@Ringmast4r</span></span>                            ║</span>');
        this.printLine('<span class="gold">╚═══════════════════════════════════════════════════════════════════╝</span>');
        this.printLine('');

        // Show daily verse
        const verse = bibleData.getRandomVerse();
        this.printLine('<div class="daily-verse">');
        this.printLine('  <div class="daily-verse-title">📖 Daily Inspirational Verse</div>');
        this.printLine(`  <div class="verse-text"><span class="cyan">${verse.ref}</span><br>      ${this.wrapText(verse.text, 55)}</div>`);
        this.printLine('</div>');

        // Show help
        this.printLine('<span class="cyan">╔══════════════════════════════════════════════════════════════════╗</span>');
        this.printLine('<span class="cyan">║</span>  <span class="gold">★ BIBLE ANALYSIS COMMANDS</span>                                        <span class="cyan">║</span>');
        this.printLine('<span class="cyan">╚══════════════════════════════════════════════════════════════════╝</span>');
        this.printLine('');
        this.printLine('  <span class="gold">📖 VERSE LOOKUP</span>');
        this.printLine('     <span class="white">Type verse reference</span>    <span class="gray">(e.g., \'John 3:16\' or \'Romans 8:28\')</span>');
        this.printLine('');
        this.printLine('  <span class="cyan">📚 CHAPTER READING</span>');
        this.printLine('     <span class="white">Type book and chapter</span>   <span class="gray">(e.g., \'Genesis 1\' or \'Psalms 23\')</span>');
        this.printLine('');
        this.printLine('  <span class="green">🔍 KEYWORD SEARCH</span>');
        this.printLine('     <span class="white">Search across all translations</span>  <span class="gray">(e.g., \'love\', \'faith\', \'grace\')</span>');
        this.printLine('');
        this.printLine('  <span class="purple">🌟 DAILY INSPIRATION</span>');
        this.printLine('     <span class="white">Type \'daily\'</span> for random verse');
        this.printLine('');
        this.printLine('  <span class="purple">🔄 BIBLE TRANSLATIONS</span>');
        this.printLine('     <span class="white">Type \'translations\'</span> to list all versions');
        this.printLine('     <span class="white">Type \'translation XXX\'</span> to switch <span class="gray">(e.g., \'translation ASV\')</span>');
        this.printLine('');
        this.printLine('  <span class="gold">🎨 THEME TOGGLE</span>');
        this.printLine('     <span class="white">Type \'t\'</span> to cycle through color themes');
        this.printLine('');
        this.printLine('  <span class="red">❌ EXIT PROGRAM</span>');
        this.printLine('     <span class="white">Type \'quit\' or \'exit\'</span> to close');
        this.printLine('');
    }

    cycleTheme() {
        // Get current theme index and cycle to next
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.currentTheme = this.themes[nextIndex];

        // Apply theme to document
        document.documentElement.setAttribute('data-theme', this.currentTheme);

        // Update header display
        const themeName = this.currentTheme.charAt(0).toUpperCase() + this.currentTheme.slice(1);
        const themeElem = document.getElementById('current-theme');
        if (themeElem) {
            themeElem.textContent = themeName;
        }

        // Show confirmation
        this.printLine('');
        this.printLine(`<span class="green">✓ Theme changed to: ${themeName}</span>`);
        this.printLine(`<span class="gray">  Press 't' again to cycle through themes</span>`);
        this.printLine('');
    }

    printLine(html) {
        const line = document.createElement('div');
        line.className = 'output-line';
        line.innerHTML = html;
        this.output.appendChild(line);
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    showLoading() {
        this.loadingIndicator.classList.add('active');
        this.input.disabled = true;
    }

    hideLoading() {
        this.loadingIndicator.classList.remove('active');
        this.input.disabled = false;
    }

    disableInput() {
        this.input.disabled = true;
        this.input.placeholder = 'Terminal closed. Refresh to restart.';
    }

    updateTranslationDisplay() {
        const info = bibleData.translationInfo[bibleData.currentTranslation];
        const elem = document.querySelector('.header-translation');
        if (elem) {
            elem.innerHTML = `Current: <span id="current-translation">${bibleData.currentTranslation}</span> - ${info.name} (${info.year})`;
        }
    }

    wrapText(text, maxLength) {
        const words = text.split(' ');
        let lines = [];
        let currentLine = '';

        for (const word of words) {
            if ((currentLine + word).length > maxLength) {
                if (currentLine) {
                    lines.push(currentLine.trim());
                    currentLine = word + ' ';
                } else {
                    lines.push(word);
                    currentLine = '';
                }
            } else {
                currentLine += word + ' ';
            }
        }

        if (currentLine) {
            lines.push(currentLine.trim());
        }

        return lines.join('<br>      ');
    }
}

// Initialize terminal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const terminal = new BibleTerminal();
});
