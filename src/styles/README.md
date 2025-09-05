# Styles Directory Structure

This directory contains all the styling files for the MERN-AUTH application, organized for better maintainability and scalability.

## Directory Structure

```
src/styles/
├── index.css                     # Main styles entry point
├── components/                   # Component-specific styles
│   └── chatbot.css              # Chatbot component styles
├── variables/                    # CSS custom properties and variables
│   └── chatbot-variables.css    # Chatbot-specific variables
└── animations/                   # Keyframe animations
    └── chatbot-animations.css   # Chatbot animation definitions
```

## Usage

### Importing Styles

1. **Main Entry Point**: Import the main styles index in your main App component:

   ```javascript
   import "./styles/index.css";
   ```

2. **Component-Specific**: Import specific component styles directly:
   ```javascript
   import "../../styles/components/chatbot.css";
   ```

### Adding New Styles

1. **Component Styles**: Create new CSS files in `components/` for each major component
2. **Variables**: Add new CSS variables in `variables/` directory
3. **Animations**: Put keyframe animations in `animations/` directory
4. **Update Index**: Add imports to `styles/index.css` for global styles

## CSS Architecture

### Variables

- All colors, sizes, and fonts are defined as CSS custom properties
- Located in `variables/` directory
- Use format: `--component-property-variant`
- Example: `--chatbot-primary`, `--chatbot-text-light`

### Components

- Each major component has its own CSS file
- Use BEM methodology for class naming
- Override framework styles with `!important` when necessary
- Import variables and animations at the top

### Animations

- All `@keyframes` are separated into animation files
- Reusable across components
- Well-documented with clear names

## Benefits

1. **Modularity**: Easy to find and maintain component-specific styles
2. **Scalability**: Simple to add new components without conflicts
3. **Reusability**: Variables and animations can be shared
4. **Organization**: Clear separation of concerns
5. **Performance**: Only import what you need

## Best Practices

1. Always use CSS variables for consistency
2. Document complex animations and styling decisions
3. Keep component styles self-contained
4. Use semantic class names
5. Avoid deep nesting (max 3 levels)
6. Test responsiveness across devices

## Chatbot Styling

The chatbot uses a modern design with:

- Gradient backgrounds with animations
- Custom fonts (Fredoka, Comfortaa, Righteous)
- Material Design icons
- Floating animations for visual appeal
- Responsive design
- Dark theme with purple/blue accents
