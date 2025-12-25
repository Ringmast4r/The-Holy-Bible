# 💻 Bible CMD Reader - Web Terminal

> Live browser-based terminal emulator of the Bible CMD Reader

**Created by [@Ringmast4r](https://github.com/Ringmast4r)**

> **📌 Note:** This is a **web demo** of the CMD tool - one of three ways to explore Bible cross-references!
> - **💻 This Tool (Web Terminal)** - Try the CMD experience in your browser
> - **💻 [Desktop CMD](../bible-analysis-tool/)** - Full Python terminal app
> - **🌐 [Web Visualizer](../bible-visualizer-web/)** - Interactive D3.js visualizations
> - **🖥️ [Desktop GUI](../bible-visualizer-desktop/)** - Professional 3D graphs

---

## 🌟 Features

### Terminal Experience
- 🎨 **Terminal-style UI** - Monospace font, dark theme, gold/cyan colors
- ⌨️ **Command history** - Use arrow keys to navigate previous commands
- 📖 **All CMD features** - Verse lookup, chapter reading, keyword search

### Bible Functions
- **Read verses** - Type "John 3:16"
- **Read chapters** - Type "Psalms 23"
- **Search keywords** - Type "love" or "faith"
- **Cross-references** - See related verses automatically
- **4 Translations** - Switch between KJV, ASV, WEB, YLT
- **Daily verse** - Random inspirational verse

---

## 🚀 Usage

### Live Demo
Visit: `https://ringmast4r.github.io/PROJECT-BIBLE-A-Proselytize-Project/bible-cmd-web/`

### Local Testing
```bash
# From project root
python -m http.server 8000

# Then open browser to:
http://localhost:8000/bible-cmd-web/
```

---

## 💡 Commands

| Command | Example | Description |
|---------|---------|-------------|
| **Verse** | `John 3:16` | Display a specific verse |
| **Chapter** | `Psalms 23` | Read an entire chapter |
| **Search** | `love` | Search keyword across Bible |
| **Daily** | `daily` | Show random verse |
| **Translations** | `translations` | List available versions |
| **Switch** | `translation ASV` | Change Bible version |
| **Help** | `help` | Show all commands |
| **Quit** | `quit` | Exit terminal |

---

## 🎨 Design

Matches the original CMD tool exactly:
- **Colors:** Gold (#FFD700), Cyan (#00CED1)
- **Font:** Monospace (Courier New, Consolas)
- **Theme:** Dark terminal aesthetic
- **Box Drawing:** Unicode characters for beautiful formatting

---

## 🔧 Technical Details

### Technology Stack
- **HTML5** - Terminal structure
- **CSS3** - Styling and animations
- **Vanilla JavaScript** - No frameworks
- **Bible Data** - Loaded from shared JSON files

### Files
```
bible-cmd-web/
├── index.html          # Terminal interface
├── css/
│   └── terminal.css    # Terminal styling
└── js/
    ├── terminal.js     # Main controller
    ├── bible-data.js   # Data loader
    └── commands.js     # Command parser
```

### Data Loading
- Loads 4 Bible translations (~30MB JSON)
- Cross-references from Treasury of Scripture Knowledge
- Async loading with progress indicator

---

## 📊 Comparison

| Feature | Web Terminal | Desktop CMD |
|---------|-------------|-------------|
| Platform | Browser | Python Terminal |
| Installation | None | Python + colorama |
| Access | Anywhere online | Local only |
| Speed | Slower (web) | Faster (native) |
| Offline | No | Yes |
| Best For | Quick demo | Daily use |

---

## 🙏 Credits

- **Author:** @Ringmast4r
- **Bible Data:** Public domain (KJV, ASV, WEB, YLT)
- **Cross-References:** Treasury of Scripture Knowledge (OpenBible.info)

---

**Try it live and explore God's Word!** ✟
