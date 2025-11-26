// backend/src/services/plate-pattern-extractor.service.js
const fs = require('fs').promises;

class PlatePatternExtractorService {
    constructor() {
        this.platePatterns = [
            { regex: /([A-Z0-9]{3}-\d{3})/gi, country: 'Peru (moderno)', confidence: 98 },

            { regex: /([A-Z]\d[A-Z]-\d{3})/gi, country: 'Peru (clásico)', confidence: 97 },

            { regex: /([A-Z0-9]{3}\d{3})/gi, country: 'Peru (sin guion)', confidence: 92 },

            { regex: /([A-Z]{2,3}-\d{3,4})/gi, country: 'Peru (genérico)', confidence: 85 },

            { regex: /([A-Z0-9]{6,8})/gi, country: 'Peru (alfanumérico)', confidence: 65 }
        ];
    }

    extractPlatesFromText(rawText) {
        if (!rawText) return [];

        const found = [];

        let cleanedText = rawText.toUpperCase().replace(/[^A-Z0-9-\s\n]/g, '');

        cleanedText = cleanedText.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();

        console.log(`🔍 Texto original: "${rawText}"`);
        console.log(`🔍 Texto limpiado: "${cleanedText}"`);

        const noSpaces = cleanedText.replace(/\s+/g, '');
        console.log(`🔍 Sin espacios: "${noSpaces}"`);

        const textVersions = [
            { text: cleanedText, label: 'con espacios' },
            { text: noSpaces, label: 'sin espacios' }
        ];

        for (const version of textVersions) {
            // Probar  patrón
            for (const pattern of this.platePatterns) {
                const matches = version.text.matchAll(pattern.regex);

                for (const match of matches) {
                    const plateText = match[1];

                    const hasLetters = /[A-Z]/.test(plateText);
                    const hasNumbers = /\d/.test(plateText);

                    if (hasLetters && hasNumbers && plateText.length >= 5) {
                        found.push({
                            text: plateText,
                            pattern: pattern.country,
                            confidence: pattern.confidence,
                            position: match.index,
                            source: version.label
                        });

                        console.log(`  ✅ Encontrado (${version.label}): "${plateText}" (${pattern.country}, ${pattern.confidence}%)`);
                    }
                }
            }
        }

        const unique = this.removeDuplicates(found);
        unique.sort((a, b) => b.confidence - a.confidence);

        return unique;
    }

    /**
     * Elimina duplicados (la misma placa puede coincidir con múltiples patrones)
     */
    removeDuplicates(plates) {
        const seen = new Set();
        return plates.filter(plate => {
            if (seen.has(plate.text)) return false;
            seen.add(plate.text);
            return true;
        });
    }

    findBestPlate(textSources) {
        const allPlates = [];

        for (const source of textSources) {
            const plates = this.extractPlatesFromText(source.text);

            plates.forEach(plate => {
                allPlates.push({
                    ...plate,
                    source: source.source,
                    sourceConfidence: source.confidence || 100
                });
            });
        }

        if (allPlates.length === 0) {
            return null;
        }

        // Calcular score combinado
        allPlates.forEach(plate => {
            plate.finalScore = (plate.confidence * 0.7) + (plate.sourceConfidence * 0.3);
        });

        // Ordenar por score final
        allPlates.sort((a, b) => b.finalScore - a.finalScore);

        return {
            bestPlate: allPlates[0],
            allMatches: allPlates.slice(0, 5) // Top 5
        };
    }
}

module.exports = new PlatePatternExtractorService();
