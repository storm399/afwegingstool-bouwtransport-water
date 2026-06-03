import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Bij productie-build (GitHub Pages) is de URL met repo-naam als pad:
//   https://storm399.github.io/afwegingstool-bouwtransport-water/
// Lokaal draait gewoon op root.
export default defineConfig(function (_a) {
    var command = _a.command;
    return ({
        plugins: [react()],
        base: command === 'build' ? '/afwegingstool-bouwtransport-water/' : '/',
        server: {
            port: 5173,
            open: true,
        },
    });
});
