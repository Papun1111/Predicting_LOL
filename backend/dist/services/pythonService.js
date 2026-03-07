import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// 1. Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 2. DYNAMIC PATH RESOLUTION (Fixes the "LOL" vs "Predicting_LOL" mismatch)
// This goes up 3 directories from dist/services to the root, then into ml
const mlDir = path.resolve(__dirname, '../../../ml');
// 3. SMART VENV DETECTION (Fixes the "venv" vs "nenv" mismatch)
let PYTHON_PATH = path.join(mlDir, 'venv', 'Scripts', 'python.exe');
if (!fs.existsSync(PYTHON_PATH)) {
    // If 'venv' doesn't exist, fallback to 'nenv' (which was in your screenshots)
    PYTHON_PATH = path.join(mlDir, 'nenv', 'Scripts', 'python.exe');
}
const runScript = (scriptName, data) => {
    return new Promise((resolve, reject) => {
        // Resolve the script path dynamically
        const scriptPath = path.join(mlDir, 'src', scriptName);
        console.log(`🐍 Target Python: ${PYTHON_PATH}`);
        console.log(`🐍 Target Script: ${scriptPath}`);
        const pythonProcess = spawn(PYTHON_PATH, [scriptPath]);
        let result = '';
        let error = '';
        // Send data to Python
        pythonProcess.stdin.write(JSON.stringify(data));
        pythonProcess.stdin.end();
        pythonProcess.stdout.on('data', (chunk) => {
            result += chunk.toString();
        });
        pythonProcess.stderr.on('data', (chunk) => {
            error += chunk.toString();
        });
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`❌ Python Process Failed (Code ${code})`);
                console.error(`--- STDOUT --- \n${result}`);
                console.error(`--- STDERR --- \n${error}`);
                reject(new Error(error || result || "Python execution failed"));
            }
            else {
                try {
                    const parsed = JSON.parse(result);
                    resolve(parsed);
                }
                catch (e) {
                    console.error("❌ JSON Parse Error. Raw output:", result);
                    reject(new Error('Invalid JSON response from AI model'));
                }
            }
        });
    });
};
export const predictMatch = async (team1, team2, team1Spells = [], team2Spells = []) => {
    // Pass all four pieces of data down to your Python script
    return runScript('predict.py', {
        team1,
        team2,
        team1Spells,
        team2Spells
    });
};
// Required for your controller imports
export const getPrediction = predictMatch;
export const recommendChamps = async (myTeam, enemyTeam) => {
    return runScript('recommend.py', { myTeam, enemyTeam });
};
//# sourceMappingURL=pythonService.js.map