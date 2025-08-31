const fs = require('fs');
const path = require('path');

// Extract class names from style files  
function extractClassNames(content) {
    const classNames = new Set();
    const matches = content.match(/\.([a-zA-Z][\w-]*)\s*{/g);
    if (matches) {
        matches.forEach(match => {
            const className = match.replace(/^\./, '').replace(/\s*{$/, '');
            classNames.add(className);
        });
    }
    return classNames;
}

// Extract used class names from component files
function extractUsedClasses(content) {
    const usedClasses = new Set();
    const matches = content.match(/styles\.(\w+)|styles\[['"](\w+)['"]\]/g);
    if (matches) {
        matches.forEach(match => {
            let className;
            if (match.includes('[')) {
                const bracketMatch = match.match(/styles\[['"](\w+)['"]\]/);
                if (bracketMatch) className = bracketMatch[1];
            } else {
                className = match.replace('styles.', '');
            }
            if (className) usedClasses.add(className);
        });
    }
    return usedClasses;
}

// Find all component files
function findFiles(dir, extensions) {
    const results = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            results.push(...findFiles(fullPath, extensions));
        } else if (extensions.some(ext => file.endsWith(ext))) {
            results.push(fullPath);
        }
    }
    return results;
}

// Main analysis
const componentFiles = findFiles('./src', ['.tsx', '.ts']);
const styleFiles = findFiles('./src', ['.scss', '.css']);

console.log('=== STYLE USAGE ANALYSIS ===\n');

// For each style file, find what classes are defined and which are used
for (const styleFile of styleFiles) {
    const styleContent = fs.readFileSync(styleFile, 'utf8');
    const definedClasses = extractClassNames(styleContent);
    
    // Find corresponding component files (same directory)
    const styleDir = path.dirname(styleFile);
    const correspondingComponents = componentFiles.filter(f => path.dirname(f) === styleDir);
    
    const usedClasses = new Set();
    for (const componentFile of correspondingComponents) {
        const componentContent = fs.readFileSync(componentFile, 'utf8');
        const used = extractUsedClasses(componentContent);
        used.forEach(cls => usedClasses.add(cls));
    }
    
    const unusedClasses = [...definedClasses].filter(cls => !usedClasses.has(cls));
    
    console.log('File:', styleFile.replace(process.cwd() + '\\src\\', ''));
    console.log('Defined classes:', definedClasses.size);
    console.log('Used classes:', usedClasses.size);
    if (unusedClasses.length > 0) {
        console.log('Potentially unused classes:', unusedClasses.join(', '));
    }
    console.log('---');
}
