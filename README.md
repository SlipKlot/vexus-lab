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

## Tilda preview

See sibling `tilda-vexus/` for the unpublished landing-page mockup and handoff. Initial integration uses a static screenshot and a standalone launch link. Embedded mode is deferred until responsive and touch checks are complete.

## 0.2 Portal update
Curved shared vessel geometry, cached grayscale liver background, textured signed color Doppler and arterial response, spectral intensity rendering, draggable calipers, envelope/extrema/cycle checks (PF tolerance 5 percentage points). Run `node portal-tests.cjs`. Synthetic educational model, not clinically validated. Hepatic and renal anatomy remain schematic.

## 0.3 Local review build (not deployed)
Per-vessel settings, Color/PW modes, frozen time, gate, Color box and measurements survive vessel navigation. Changing a caliper clears the old final assessment. Moving only the Color box preserves the PW acquisition; moving the gate, changing spectral coordinates, resuming acquisition or toggling PW invalidates it. New cases start on portal vein. Caliper hit targets now use CSS pixels for consistent touch/mouse sizing. State is in-memory only and resets on reload.

Regression checks: `node tests.cjs`, `node portal-tests.cjs`, `node state-tests.cjs`. The last suite runs real app handlers with a minimal DOM/Canvas adapter; it does not replace browser/clinical testing.

## Local version 0.4 (2026-11-06; not published)

New synthetic liver and kidney B-mode backgrounds, original curved hepatic and intrarenal vessel geometry, animated Color, grainy PW spectrum, adjustable sample volume and acquisition checks. The same vessel geometry drives rendering and gate coverage. Renal arterial signal appears when the gate overlaps an adjacent artery. Discontinuous renal patterns contain true zero-flow intervals.

Learning flow: manually position PW, adjust acquisition settings, freeze, identify the pattern, then answer a limitation question. Portal PF remains a separate measurement task. Automated checks cover anatomy, waveforms, seven cases, portal calculations and state invalidation.

Source: Assavapokee et al., Decoding VExUS (2024), https://link.springer.com/article/10.1186/s13089-024-00396-z . NotebookLM supplied an organizational outline; unverified generated claims were not adopted. The source supports acquisition technique and interpretation limitations. Pixel coverage thresholds, gain bounds and screen-position checks are simulator heuristics, not validated clinical cutoffs. This is not a patient-specific diagnostic or treatment tool, and no veterinary validation is claimed.

Assets: assets/liver-bmode.png and assets/kidney-bmode.png were generated with OpenAI image generation for this prototype. Prompts requested grayscale convex-probe tissue anatomy, realistic speckle and attenuation, no interface, labels, Color or spectra. Interactive vessels, Color, PW and ECG are programmed separately; generated anatomy is illustrative and has not undergone independent clinical review. No NotebookLM screenshots or article illustrations are redistributed.

Rendering is capped near 15 fps while live; frozen frames redraw only after UI changes. This reduces needless canvas work. No external libraries or network calls are required to use the trainer after loading local assets.

Verification commands:
- node tests.cjs
- node portal-tests.cjs
- node anatomy-tests.cjs
- node state-tests.cjs

## Local version 0.5 — illustrated atlas

Nine cards use the nine user-supplied illustrations. Open “Изучить VExUS” in the header. A modal dialog preserves the trainer's state; its live animation pauses while the atlas is open. Escape or the return button closes the atlas. Atlas completion is stored separately in localStorage (vexus-atlas-v1); reset affects only atlas progress.

Original PNG copies: ../vexus-atlas-originals. JPEG delivery copies: assets/atlas/1.jpg through 9.jpg (total 2,389,856 bytes). Originals are not modified. atlas.js contains card text, source figure links, normalized overlay positions and exercise regions. atlas.css provides responsive layout, zoom and overlay styling.

Source mapping: card 1 → figure 1; cards 2/3 → figure 2; card 4 → figure 3; card 5 → figure 4; card 6 → figure 5; card 7 → figure 6; card 8 → figure 7; card 9 → figure 8 of Assavapokee et al., Decoding VExUS, 2024, DOI 10.1186/s13089-024-00396-z. Images are user-provided generated adaptations, not original clinical ultrasound acquisitions. No unverified NotebookLM claims were added. Figure links are provenance links, not a claim of clinical validation.

Limitations: clickable regions and caliper targets are illustrative model coordinates, with tolerance for a learning task. No centimeter result or diagnostic inference is calculated from the generated images. Orientation markers on probe bodies are unclear; the atlas explicitly explains this rather than inventing a marker. Annotation and anatomy need independent clinical review before public release. Renal-specific probe access is not depicted by this set. Human anatomy only.

Validation: all four existing Node test suites pass; atlas.js syntax checked. Browser walkthrough completed 9/9, including two vessel selections and manual two-point placement. Color/PW/frozen state preserved after closing atlas. Browser console had no errors. Responsive CSS included; dedicated phone viewport verification remains outstanding. Nothing published.
