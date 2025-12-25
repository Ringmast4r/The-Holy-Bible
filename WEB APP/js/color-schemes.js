// Color Schemes for Distance Visualization
// Easter Egg: Click the legend to cycle through color schemes!

class ColorSchemes {
    constructor() {
        this.schemes = {
            rainbow: {
                name: 'Rainbow',
                emoji: '🌈',
                interpolator: d3.interpolateRainbow,
                description: 'Classic rainbow spectrum'
            },
            thermal: {
                name: 'Heat Map',
                emoji: '🔥',
                interpolator: d3.interpolateInferno,
                description: 'Black → Red → Yellow'
            },
            ocean: {
                name: 'Ocean Depths',
                emoji: '🌊',
                interpolator: d3.interpolateViridis,
                description: 'Purple → Blue → Green → Yellow'
            },
            sunset: {
                name: 'Sunset',
                emoji: '🌅',
                interpolator: d3.interpolateWarm,
                description: 'Purple → Red → Orange → Yellow'
            },
            cool: {
                name: 'Cool Blues',
                emoji: '❄️',
                interpolator: d3.interpolateCool,
                description: 'Cyan → Blue → Purple'
            },
            plasma: {
                name: 'Plasma',
                emoji: '⚡',
                interpolator: d3.interpolatePlasma,
                description: 'Blue → Purple → Orange → Yellow'
            },
            forest: {
                name: 'Forest',
                emoji: '🌲',
                interpolator: d3.interpolateGreens,
                description: 'Light Green → Dark Green'
            },
            biblical: {
                name: 'Biblical',
                emoji: '✝️',
                interpolator: this.createBiblicalInterpolator(),
                description: 'Gold → Purple → Cyan (site theme)'
            },
            grayscale: {
                name: 'Grayscale',
                emoji: '⚫',
                interpolator: d3.interpolateGreys,
                description: 'White → Black (high contrast)'
            },
            redblue: {
                name: 'Red-Blue',
                emoji: '🔴🔵',
                interpolator: d3.interpolateRdBu,
                description: 'Red → White → Blue'
            }
        };

        // ALWAYS start with rainbow (ignore localStorage for fresh page loads)
        // Arc and Radial diagrams should showcase the beautiful rainbow first!
        this.currentScheme = 'rainbow';
        localStorage.setItem('bible-viz-color-scheme', 'rainbow');

        // Order for cycling
        this.schemeOrder = ['rainbow', 'thermal', 'ocean', 'sunset', 'cool',
                           'plasma', 'forest', 'biblical', 'grayscale', 'redblue'];
    }

    /**
     * Create custom Biblical color scheme (gold → purple → cyan)
     */
    createBiblicalInterpolator() {
        const biblicalScale = d3.scaleLinear()
            .domain([0, 0.5, 1])
            .range(['#FFD700', '#9B59B6', '#00CED1']); // Gold → Purple → Cyan

        return (t) => biblicalScale(t);
    }

    /**
     * Get current color scheme interpolator
     */
    getCurrentInterpolator() {
        return this.schemes[this.currentScheme].interpolator;
    }

    /**
     * Get current scheme info
     */
    getCurrentScheme() {
        return {
            id: this.currentScheme,
            ...this.schemes[this.currentScheme]
        };
    }

    /**
     * Cycle to next color scheme
     */
    nextScheme() {
        const currentIndex = this.schemeOrder.indexOf(this.currentScheme);
        const nextIndex = (currentIndex + 1) % this.schemeOrder.length;
        this.currentScheme = this.schemeOrder[nextIndex];

        // Save to localStorage
        localStorage.setItem('bible-viz-color-scheme', this.currentScheme);

        console.log(`🎨 Color scheme changed to: ${this.getCurrentScheme().name} ${this.getCurrentScheme().emoji}`);

        return this.getCurrentScheme();
    }

    /**
     * Create color scale for distance-based coloring
     */
    createDistanceScale(maxDistance) {
        const interpolator = this.getCurrentInterpolator();
        return d3.scaleSequential(interpolator)
            .domain([0, maxDistance]);
    }

    /**
     * Get color for a specific distance value
     */
    getColor(distance, maxDistance) {
        const scale = this.createDistanceScale(maxDistance);
        return scale(distance);
    }

}

// Global instance
window.colorSchemes = new ColorSchemes();

console.log('🎨 Color Schemes loaded! Click the legend to cycle through schemes.');
