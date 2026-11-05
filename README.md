# POCUS MOSCOW · VExUS Lab

Standalone Russian-language educational prototype. Original schematic Canvas anatomy and synthetic Doppler signals. No patient data, accounts, tracking or external dependencies.

## Run

`python -m http.server 8765` then open http://localhost:8765

Tests: `node tests.cjs`

## GitHub Pages

Publish this directory to a repository. Settings → Pages → Deploy from a branch → main → / (root). All asset paths are relative, so project Pages URLs and iframe embeds work.

## Scope

Seven cases, three veins, random mystery case, Color/PW controls, draggable gate and color box, keyboard positioning, synthetic ECG and spectrum, freeze, two-point signed velocity measurements and portal PF, retryable answers, final grade after all three correct answers. Fresh patient resets progress. Initial release requires independent clinical review.

The geometry and waveforms are simplified teaching models, not a physical ultrasound simulator. No patient-specific diagnostic or therapeutic decisions. Color scale/gain are approximations; no beam-angle correction, real spectral estimation, probe navigation or actual Doppler acquisition. Negative portal minima are included in PF. In this implementation severe portal PF is >=50%; IVC threshold is >=2 cm. A blunted cirrhosis pattern is explicitly identified as unreliable rather than assigned a severity.

References: https://pmc.ncbi.nlm.nih.gov/articles/PMC7142196/ and https://pmc.ncbi.nlm.nih.gov/articles/PMC10063755/

## Tilda later

Use a T123 HTML block containing an iframe with the deployed HTTPS URL, width 100%, height around 1600px, title="Тренажёр VExUS". Also provide a link to open the trainer in its own tab. Height must be adjusted after testing the actual Tilda layout. No Tilda changes are required for standalone use.
