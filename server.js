const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Dossier des données
const dataFolder = path.join(__dirname, 'data');
const csvFile = path.join(dataFolder, 'donnees.csv');

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
}

// Route POST pour envoyer les données
app.post('/api/submit', (req, res) => {
    const { classe, Jour, nomComplet, timestamp } = req.body;

    // Validation
    if (!classe || !Jour || !nomComplet) {
        return res.status(400).json({ 
            success: false, 
            message: 'Tous les champs sont obligatoires' 
        });
    }

    try {
        // Vérifier si le fichier existe
        const fileExists = fs.existsSync(csvFile);

        // Préparer les données
        const data = {
            timestamp: timestamp || new Date().toLocaleString('fr-FR'),
            nomComplet: nomComplet,
            classe: classe,
            Jour: Jour
        };

        // Ajouter une ligne au CSV
        if (fileExists) {
            // Ajouter à un fichier existant
            fs.appendFileSync(csvFile, 
                `${data.timestamp},"${data.nomComplet}","${data.classe}","${data.Jour}"\n`
            );
        } else {
            // Créer le fichier avec en-têtes
            const header = 'Timestamp,Nom Complet,Classe,Jour\n';
            const row = `${data.timestamp},"${data.nomComplet}","${data.classe}","${data.Jour}"\n`;
            fs.writeFileSync(csvFile, header + row);
        }

        res.json({ 
            success: true, 
            message: 'Données enregistrées avec succès',
            file: csvFile
        });

    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        res.status(500).json({ 
            success: false, 
            message: error.toString() 
        });
    }
});

// Route GET pour récupérer les dernières entrées
app.get('/api/entries', (req, res) => {
    try {
        if (!fs.existsSync(csvFile)) {
            return res.json({ entries: [] });
        }

        const entries = [];
        fs.createReadStream(csvFile)
            .pipe(csv({
                headers: ['timestamp', 'nomComplet', 'classe', 'Jour'],
                skipLines: 1
            }))
            .on('data', (row) => {
                entries.push(row);
            })
            .on('end', () => {
                // Inverser pour afficher les plus récentes en premier
                res.json({ entries: entries.reverse() });
            });

    } catch (error) {
        console.error('Erreur lors de la lecture:', error);
        res.status(500).json({ 
            success: false, 
            message: error.toString() 
        });
    }
});

// Route GET pour télécharger le CSV
app.get('/api/download', (req, res) => {
    try {
        if (!fs.existsSync(csvFile)) {
            return res.status(404).json({ 
                success: false, 
                message: 'Aucun fichier trouvé' 
            });
        }

        res.download(csvFile, 'donnees.csv');

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.toString() 
        });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`✓ Serveur démarré sur http://localhost:${PORT}`);
    console.log(`✓ Les données seront enregistrées dans: ${csvFile}`);
});
