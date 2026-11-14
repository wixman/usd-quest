// ============================================================
//  PART 5: HOUDINI SOLARIS (chapters 7–12)
// ============================================================

// ------------------------------------------------------------ S7
UNITS.push({
  id: 's7', part: 'p5', title: 'MATERIALS & MATERIALX', sub: 'Look development in LOPs', emoji: '🖌️', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 's7l1', kind: 'lesson', title: 'Material Library', steps: [
      { t: 'info', h: 'Shaders → USD prims', p: `The <b>Material Library LOP</b> contains a VOP network. Every material you build inside it becomes a USD <b>Material</b> prim (with Shader prims inside) on the stage. Double-click it to go inside.<br><br>Two builders matter:<br>• <b>Karma Material Builder</b> (Karma MaterialX Builder): the tab menu shows Karma-compatible MaterialX, Preview Surface and Karma nodes. This is the usual choice.<br>• <b>USD MaterialX Builder</b>: pure-USD MaterialX graphs, for portability to other renderers` },
      { t: 'info', h: 'Why MaterialX', p: `<b>MaterialX</b> is an open standard for shading networks. In Solaris, MaterialX nodes are stored directly as USD shader prims.<br><br>Karma <b>XPU never supports VEX shaders</b>, so MaterialX is described as "probably the future" of Karma shading. It works on both Karma CPU and XPU.` },
      { t: 'mcq', q: 'You want a material that renders on both Karma CPU and XPU. Build it from…', o: ['VEX shader nodes', 'MaterialX nodes', 'Mantra Principled', 'Material style sheets'], a: 1, why: 'XPU never supports VEX shaders. MaterialX works on both.' },
      { t: 'info', h: 'The node toolkit', p: `• <b>MtlX Standard Surface</b>: the go-to physically based uber-shader (like Principled). <b>MtlX OpenPBR Surface</b> is the newer standard.<br>• <b>MtlX Image</b>: textures. Set <b>Signature</b> to <i>Color</i> for colour maps, and <i>Vector3</i> for normal maps (so no colour space is applied).<br>• <b>MtlX Texcoord</b>: reads <code>st</code>/<code>uv</code> (Signature Vector2).<br>• <b>MtlX Normalmap</b>: tangent-space → world normal for the shader's <code>normal</code> input.<br>• <b>MtlX Geompropvalue</b>: read <b>any primvar</b> (without the <code>primvars:</code> prefix).<br>• <b>MtlX Displacement</b> → wire into a <b>Surface Material</b> (or Collect) node.<br>• Filenames support the <code>&lt;UDIM&gt;</code> token.` },
      { t: 'mcq', q: 'Reading a normal map with MtlX Image, Signature should be…', o: ['Color', 'Vector3', 'Float', 'String'], a: 1, why: 'Vector3, so no colour-space transform corrupts the normal data.' },
      { t: 'mcq', q: 'Read a custom primvar "wetness" inside a MaterialX network:', o: ['MtlX Geompropvalue with name "wetness"', 'MtlX Image', 'Attribute Wrangle', 'primvars:wetness texture'], a: 0, why: 'Geompropvalue reads primvars by name, without the primvars: prefix.' },
      { t: 'info', h: 'Gotchas', p: `• Colour Space parameters are <b>metadata only</b>. Hydra doesn't pass them to delegates.<br>• MaterialX has no string inputs, so you can't wire primvar <i>names</i> from a material's public interface.<br>• Karma doesn't support MaterialX light shaders, or surface + volume materials on the same prim.<br>• Only <code>&lt;UDIM&gt;</code> works as a filename token. MaterialX <code>{frame}</code> does not.` },
      { t: 'info', h: 'Key takeaways', p: `• Material Library → Karma Material Builder → MaterialX nodes → USD Material prims<br>• Standard Surface / OpenPBR, MtlX Image (signatures!), Texcoord, Normalmap, Geompropvalue<br>• XPU needs MaterialX (no VEX). Only <code>&lt;UDIM&gt;</code> tokens` },
    ]},
    { id: 's7l2', kind: 'lesson', title: 'Assigning materials', steps: [
      { t: 'info', h: 'Assign Material', p: `The <b>Assign Material</b> LOP binds materials to prims: set <b>Primitives</b> (a pattern) and the <b>Material Path</b> (e.g. <code>/materials/rust</code>). It authors MaterialBindingAPI + <code>material:binding</code> for you, and can also handle overrides, VEX-driven assignments and geometry subsets.<br><br>Assignments made directly on the Material Library LOP work too.` },
      { t: 'info', h: 'More tools', p: `• <b>Material Linker</b>: rule-based assignments with a UI<br>• <b>Edit Material Network</b>: change parameters and connections of existing materials, even ones from files you can't edit<br>• <b>Edit Material Properties</b>: a spare-parm interface for material inputs<br>• <b>Material Variation</b>: per-prim/per-instance overrides of material parameters (via primvars)<br>• <b>Vary Material Assignment</b>: randomise which material each prim gets<br>• <b>Unassign Material</b>` },
      { t: 'match', q: 'Match the LOP.', pairs: [['Assign Material', 'Bind by pattern'], ['Material Linker', 'Rule-based assignments'], ['Edit Material Network', 'Tweak existing materials'], ['Material Variation', 'Per-instance parameter overrides']] },
      { t: 'info', h: 'Reusing .mtlx files', p: `To use a MaterialX document from disk, use a <b>Reference LOP</b> pointing at the <code>.mtlx</code>, pick the material via <b>Reference Primitive</b>, then assign it. SideFX recommends <b>referencing</b> over sublayering for this.<br><br>Right-click a material prim → <b>Edit Primitive ▸ New node to edit primitive…</b> creates an edit node for it.` },
      { t: 'tf', q: 'A .mtlx file can be brought into Solaris with a Reference LOP.', a: true, why: 'USD\'s MaterialX file format plugin reads .mtlx as a layer.' },
      { t: 'info', h: 'Key takeaways', p: `• Assign Material (pattern + material path) is the workhorse<br>• Material Linker, Edit Material Network, Material Variation, Vary Material Assignment<br>• Reference .mtlx files, then assign` },
    ]},
    { id: 's7d1', kind: 'drill', title: 'Lookdev drill', steps: [
      { t: 'mcq', q: 'Which LOP turns VOP shader networks into USD Material prims?', o: ['Material Library', 'Assign Material', 'SOP Import', 'Configure Layer'], a: 0, why: 'Material Library.' },
      { t: 'tf', q: 'Karma XPU can render VEX-based shaders.', a: false, why: 'XPU never supports VEX shaders.' },
      { t: 'mcq', q: 'Texture filename token for tiled UV textures:', o: ['<UDIM>', '{frame}', '$F4', '%(tile)d'], a: 0, why: '<UDIM> is supported. MaterialX {frame} is not.' },
      { t: 'mcq', q: 'Colour map in MtlX Image, Signature:', o: ['Color', 'Vector3', 'Integer', 'Matrix'], a: 0, why: 'Color for colour maps.' },
    ]},
  ]
});

// ------------------------------------------------------------ S8
UNITS.push({
  id: 's8', part: 'p5', title: 'LIGHTS & CAMERAS', sub: 'Lighting in Solaris', emoji: '🔦', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 's8l1', kind: 'lesson', title: 'Light LOPs', steps: [
      { t: 'info', h: 'Creating lights', p: `• <b>Light LOP</b>: creates or edits any UsdLux light (rect, disk, sphere, cylinder…)<br>• <b>Distant Light</b> (sun) and <b>Dome Light</b> (HDRI environment)<br>• <b>Geometry Light</b>: turns geometry into lights (MeshLightAPI)<br>• <b>Portal Light</b>: limits which parts of a dome light are sampled, e.g. through windows, for cleaner interiors<br>• <b>Karma Physical Sky</b> / <b>Karma Sky Dome Light</b> / <b>Karma Sky Atmosphere</b>: sun + sky rigs<br><br>They author standard UsdLux prims (<code>inputs:intensity</code>, <code>inputs:exposure</code>, <code>inputs:color</code>…), so everything from the UsdLux unit applies.` },
      { t: 'info', h: 'A Houdini gotcha', p: `In classic Houdini, hiding a light's display didn't stop it lighting the scene. In <b>LOPs/USD</b>, turning off a light's display (visibility) <b>does turn off its contribution</b>.` },
      { t: 'tf', q: 'In Solaris, making a light invisible also stops it illuminating the scene.', a: true, why: 'Unlike classic Houdini, USD visibility switches off the light\'s contribution.' },
      { t: 'mcq', q: 'An interior lit by a dome through windows is noisy. Which helps sampling?', o: ['Portal Light', 'Geometry Light', 'Light Mixer', 'Distant Light'], a: 0, why: 'Portal lights focus dome-light sampling through openings.' },
      { t: 'info', h: 'Managing many lights', p: `• <b>Light Mixer</b>: an interactive panel to edit intensity, exposure, colour, solo and mute across many lights at once<br>• <b>Light Linker</b>: authors light-linking and shadow-linking collections from rules (who lights what)<br>• <b>Light Filter Library</b> / <b>Karma Blocker Light Filter</b>: shape and block light<br>• <b>LPE Tag</b>: tag lights so you can split them into separate AOVs` },
      { t: 'match', q: 'Match.', pairs: [['Light Mixer', 'Balance many lights interactively'], ['Light Linker', 'Who lights what'], ['LPE Tag', 'Per-light AOVs'], ['Portal Light', 'Guide dome sampling']] },
      { t: 'info', h: 'Key takeaways', p: `• Light / Distant / Dome / Geometry / Portal / Physical Sky LOPs author UsdLux prims<br>• Invisible light = no contribution in USD<br>• Light Mixer, Light Linker, light filters, LPE Tag` },
    ]},
    { id: 's8l2', kind: 'lesson', title: 'Cameras & constraints', steps: [
      { t: 'info', h: 'Camera LOP', p: `The <b>Camera LOP</b> creates a USD Camera prim (focal length, aperture, clipping, fStop, focus distance). Look through it in the viewport, or <b>lock</b> the view to it to place it interactively.<br><br>Karma needs a camera: the render settings point at it (<code>rel camera</code>).` },
      { t: 'info', h: 'Constraints', p: `LOPs can evaluate constraints live and <b>bake</b> the results into transforms when USD is written (USD stores results, not rigs):<br><br>• <b>Look At Constraint</b>: keep a prim (camera, light) aimed at a target<br>• <b>Parent Constraint</b>, <b>Follow Path Constraint</b>, <b>Points Constraint</b>, <b>Surface Constraint</b>, <b>Blend Constraint</b>` },
      { t: 'mcq', q: 'Keep a spotlight aimed at a moving character:', o: ['Look At Constraint', 'Light Linker', 'Parent Constraint', 'Draw Mode'], a: 0, why: 'Look At Constraint.' },
      { t: 'tf', q: 'USD stores live constraint rigs that renderers evaluate.', a: false, why: 'USD stores computed results. LOP constraints are baked when written out.' },
      { t: 'info', h: 'Key takeaways', p: `• Camera LOP → a USD Camera, which render settings reference<br>• Constraint LOPs (Look At, Parent, Follow Path…) bake to transforms on output` },
    ]},
    { id: 's8d1', kind: 'drill', title: 'Lighting drill', steps: [
      { t: 'mcq', q: 'An HDRI environment light:', o: ['Distant Light', 'Dome Light', 'Portal Light', 'Geometry Light'], a: 1, why: 'Dome Light.' },
      { t: 'mcq', q: 'Make the rim light skip the hero\'s face:', o: ['Light Linker', 'Light Mixer', 'Prune', 'Draw Mode'], a: 0, why: 'Light linking collections, authored by the Light Linker.' },
      { t: 'tf', q: 'The Light Mixer can solo and mute lights.', a: true, why: 'Yes, it\'s an interactive lighting control panel.' },
    ]},
  ]
});

// ------------------------------------------------------------ S9
UNITS.push({
  id: 's9', part: 'p5', title: 'KARMA RENDERING', sub: 'CPU vs XPU, settings, AOVs, husk', emoji: '📸', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 's9l1', kind: 'lesson', title: 'Karma basics', steps: [
      { t: 'info', h: 'What Karma is', p: `<b>Karma</b> is Houdini's physically based path tracer, built on USD: it's a <b>Hydra render delegate</b> and it reads USD scenes. It replaces Mantra for new projects.<br><br>Two engines:<br>• <b>Karma CPU</b>: runs entirely on the CPU and supports more legacy features<br>• <b>Karma XPU</b>: CPU + GPU together, much faster, but drops more legacy features (e.g. <b>no VEX shaders</b>)` },
      { t: 'match', q: 'Match.', pairs: [['Karma CPU', 'CPU only, more legacy features'], ['Karma XPU', 'CPU + GPU, no VEX shaders'], ['Hydra delegate', 'How Karma plugs into the viewer'], ['Mantra', 'The older renderer Karma replaces']] },
      { t: 'info', h: 'Setting up a render (Houdini 22)', p: `The modern setup is two nodes:<br><br>1️⃣ <b>Karma Render Settings LOP</b>: creates the <b>RenderSettings</b>, <b>RenderProduct</b> and <b>RenderVar</b> prims, configured for Karma (camera, resolution, samples, AOVs, output path)<br>2️⃣ <b>USD Render ROP</b> (also available as a LOP): renders the stage. It hands the USD to <b>husk</b>, Karma's command-line renderer<div class="hou">🆕 The all-in-one <b>Karma LOP</b> and the old <b>Karma Render Properties</b> node are <b>deprecated</b> in Houdini 22. Use Karma Render Settings + USD Render instead.</div>` },
      { t: 'mcq', q: 'In Houdini 22, the recommended render setup is…', o: ['Karma LOP only', 'Karma Render Settings LOP + USD Render ROP', 'Mantra ROP', 'Karma Render Properties'], a: 1, why: 'The Karma LOP and Karma Render Properties are deprecated.' },
      { t: 'info', h: 'Previewing', p: `• <b>Viewport IPR</b>: switch the viewer delegate to Karma CPU/XPU<br>• <b>Render to MPlay</b>: a progressive preview window, where clicking an area focuses the render there<br>• <b>Render Gallery</b>: Snap captures the viewport, and Background renders into the snapshot strip (snapshots from the viewport don't capture every AOV)` },
      { t: 'info', h: 'Key takeaways', p: `• Karma = USD path tracer and Hydra delegate. CPU vs XPU (no VEX on XPU)<br>• Karma Render Settings LOP + USD Render ROP (→ husk)<br>• Preview with viewport IPR, MPlay or the Render Gallery` },
    ]},
    { id: 's9l2', kind: 'lesson', title: 'Sampling & noise', steps: [
      { t: 'info', h: 'Primary samples', p: `<b>Primary samples</b> (also called <b>pixel samples</b>) are rays fired from the camera through each pixel. They resolve anti-aliasing, motion blur and depth of field.<br><br>On <b>XPU</b>, the main control is <b>Path Traced Samples</b>: the number of camera paths per pixel. More samples, less noise.` },
      { t: 'info', h: 'Convergence modes', p: `The <b>convergence mode</b> decides how secondary (bounce) rays are sent:<br><br>• <b>Path Traced</b>: at most one indirect ray per bounce. Simple and fast to start. <b>XPU only supports this mode.</b><br>• <b>Automatic</b> (CPU only): Karma decides how many secondary rays each bounce needs, with many per-component controls (diffuse, reflection, refraction, SSS quality…)<br><br>A <b>pixel oracle</b> (default: <b>Variance</b>) stops sampling pixels once they're clean enough (the <b>Variance Threshold</b>).` },
      { t: 'mcq', q: 'Which convergence mode does Karma XPU support?', o: ['Automatic', 'Path Traced', 'Both', 'Neither'], a: 1, why: 'XPU only supports Path Traced.' },
      { t: 'mcq', q: 'Your XPU render is noisy everywhere. Main control to raise?', o: ['Path Traced Samples', 'Secondary Noise Level', 'Diffuse Quality', 'Ray Bias'], a: 0, why: 'On XPU, adding path-traced samples is the main lever for all noise.' },
      { t: 'info', h: 'Denoising & tips', p: `• Karma ships with <b>Intel OIDN</b>, and NVIDIA <b>OptiX</b> is also supported<br>• Use <b>Portal Lights</b> for dome-lit interiors<br>• Strong depth of field or heavy motion often converges faster with path-traced convergence or a uniform pixel oracle<br>• Rendering several frames in one process saves time` },
      { t: 'tf', q: 'Primary/path traced samples can be set per object with Render Geometry Settings.', a: false, why: 'Primary Samples and Path Traced Samples can\'t be set per object.' },
      { t: 'info', h: 'Key takeaways', p: `• Primary (pixel) samples vs secondary rays. XPU: Path Traced Samples<br>• Convergence: Path Traced (CPU+XPU) or Automatic (CPU only). The pixel oracle stops clean pixels early<br>• Denoise with OIDN / OptiX` },
    ]},
    { id: 's9l3', kind: 'lesson', title: 'AOVs & per-object settings', steps: [
      { t: 'info', h: 'AOVs = RenderVars', p: `Extra image planes (AOVs) are <b>RenderVar</b> prims in USD:<br><br>• <b>Karma Standard Render Vars</b>: quickly adds the standard Karma AOVs (diffuse, specular, emission, albedo, normal, depth…)<br>• <b>Render Var LOP</b>: define any variable, including a <b>Light Path Expression</b> (LPE) such as <code>C&lt;RD&gt;L</code> for direct diffuse<br>• <b>Karma Cryptomatte</b>: ID mattes for compositing<br>• <b>Render Product</b> / <b>Karma Render Products</b>: group vars into output files` },
      { t: 'mcq', q: 'An AOV in USD terms is a…', o: ['RenderProduct', 'RenderVar', 'RenderSettings', 'Collection'], a: 1, why: 'Each channel/AOV is a RenderVar.' },
      { t: 'info', h: 'Per-object & per-light settings', p: `• <b>Render Geometry Settings</b> LOP: per-object Karma settings (e.g. render visibility, subdivision, displacement quality, motion blur samples, holdouts). Karma object properties live in the <code>primvars:karma:object</code> namespace, which is why they inherit down the tree like constant primvars.<br>• <b>Lights</b>: Karma light properties live under <code>inputs:karma:light</code>.<br>• <b>Karma Shadow Catcher</b>, <b>Karma Background Plate</b>: holdouts and matte setups.` },
      { t: 'mcq', q: 'Why do Karma per-object settings inherit from parent prims?', o: ['They\'re variants', 'They\'re stored as primvars (primvars:karma:object…)', 'Houdini copies them', 'They don\'t'], a: 1, why: 'Constant primvars inherit down namespace.' },
      { t: 'info', h: 'husk', p: `<b>husk</b> is Karma's standalone command-line renderer. It renders any USD file with RenderSettings, which is great on a farm:<br><br><code>husk shot.usd</code> (with options for frame range, output and so on)<br><br>The USD Render ROP writes the USD, then runs husk on it. husk can render several RenderSettings prims from one process.` },
      { t: 'tf', q: 'husk can render a USD file outside of an interactive Houdini session.', a: true, why: 'It\'s a standalone command-line renderer.' },
      { t: 'info', h: 'Key takeaways', p: `• AOVs = RenderVars: Standard Render Vars, Render Var (LPEs), Cryptomatte<br>• Render Geometry Settings → <code>primvars:karma:object…</code> (inherits). Lights → <code>inputs:karma:light…</code><br>• <b>husk</b> renders USD from the command line` },
    ]},
    { id: 's9d1', kind: 'drill', title: 'Karma drill', steps: [
      { t: 'match', q: 'Match the node.', pairs: [['Karma Render Settings', 'Settings/Product/Vars prims'], ['USD Render ROP', 'Launches the render (husk)'], ['Karma Cryptomatte', 'ID mattes'], ['Render Geometry Settings', 'Per-object settings']] },
      { t: 'tf', q: 'Karma CPU supports Automatic convergence.', a: true, why: 'CPU supports Automatic and Path Traced.' },
      { t: 'mcq', q: 'Default pixel oracle:', o: ['Uniform', 'Variance', 'None', 'Adaptive LPE'], a: 1, why: 'Variance.' },
      { t: 'mcq', q: 'Which ships with Karma out of the box for denoising?', o: ['Intel OIDN', 'Neat Video', 'RenderMan denoiser', 'None'], a: 0, why: 'OIDN, with OptiX also supported.' },
    ]},
  ]
});

// ------------------------------------------------------------ S10
UNITS.push({
  id: 's10', part: 'p5', title: 'WRITING USD', sub: 'USD ROP, save paths, time & caching', emoji: '💾', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 's10l1', kind: 'lesson', title: 'The USD ROP', steps: [
      { t: 'info', h: 'Writing to disk', p: `The <b>USD</b> render node writes your stage out. It exists as a <b>LOP</b> (at the end of a network) and as a <b>ROP</b> (in a render network pointing at a LOP).<br><br>• <b>Output File</b>: the top-level file, which receives the root layer data<br>• Layers with a <b>save path</b> are written to <b>their own files</b><br>• Layers <b>read from disk</b> are left unmodified<br>• In-memory layers without a save path are folded into the top-level output file` },
      { t: 'info', h: 'Save paths', p: `Give layers their own files with:<br>• <b>Configure Layer</b> → save path<br>• <b>SOP Import</b> / <b>SOP Create</b> → their own save path parameter<br><br>Use <b>absolute</b> paths with variables, e.g. <code>$HIP/usd/props/lamp.usd</code>. The default <b>output processor</b> converts them into <b>relative references</b> between the written files, so the whole set can be moved as a unit.` },
      { t: 'mcq', q: 'Why does the default output processor make references relative?', o: ['Smaller files', 'So the written file set can be moved together', 'Required by USD', 'For Karma XPU'], a: 1, why: 'Relative references keep the bundle portable.' },
      { t: 'info', h: 'Output processors', p: `Output processors are <b>Python plugins</b> that can rewrite save paths, rewrite reference strings and edit each <code>Sdf.Layer</code> before it's written. Studios use them to map paths to their asset system. They live in <code>husdplugins/outputprocessors/</code> on the Houdini path.` },
      { t: 'tf', q: 'The USD ROP rewrites layers that were sublayered from disk.', a: false, why: 'Layers read from disk are left unmodified.' },
      { t: 'info', h: 'Key takeaways', p: `• USD ROP/LOP: Output File + any layer with a save path<br>• Save paths via Configure Layer, SOP Import, SOP Create<br>• Output processors make paths relative (default) or apply studio rules` },
    ]},
    { id: 's10l2', kind: 'lesson', title: 'Time & caching', steps: [
      { t: 'info', h: 'LOPs cook one frame', p: `LOP nodes cook <b>one frame at a time</b>, so the in-memory layers hold a <b>single time sample</b> for the current frame. When you change frames, they recook.<br><br>To get animation into a file, the <b>USD ROP</b> cooks every frame in the range and writes the time samples out. A <b>Cache LOP</b> can store several frames in memory to speed up playback.` },
      { t: 'info', h: 'Flush Data After Each Frame', p: `This USD ROP option controls memory use:<br><br>• <b>Off</b>: each frame is held in memory and stitched with the previous ones, which can use a lot of memory<br>• <b>On</b>: each frame is written to disk as soon as it's cooked<br><br>And the file name matters:<br>• save path <b>with <code>$F</code></b> → <b>one file per frame</b> (each with one sample)<br>• <b>without</b> → <b>one file</b> holding all the samples` },
      { t: 'mcq', q: 'Save path is <code>$HIP/usd/fx/smoke.$F4.usd</code>. What do you get?', o: ['One file with all frames', 'One file per frame', 'An error', 'A .usdz'], a: 1, why: 'A time-varying token like $F gives a file per frame.' },
      { t: 'info', h: 'Value clips & packaging', p: `• For huge per-frame caches, write one file per frame, then combine them into a <b>value clip</b> with the <b>USD Stitch Clips</b> ROP. Only works when the data sits on its own branch.<br>• <b>File Cache</b> LOP: writes layers to disk once, then reads them back (like a SOP File Cache)<br>• <b>USD Zip</b>: builds a single <code>.usdz</code> from written files (with textures)<br>• <b>Geometry Sequence</b> / <b>Geometry Clip Sequence</b>: bring file sequences back in` },
      { t: 'match', q: 'Match.', pairs: [['Cache LOP', 'Hold several frames in memory'], ['File Cache LOP', 'Write once, read back'], ['USD Stitch Clips', 'Per-frame files → value clip'], ['USD Zip', 'Build a .usdz']] },
      { t: 'info', h: 'Context options', p: `<b>Context options</b> are global or network-scoped variables (Edit ▸ Context Options) that you read in expressions with <code>@optionname</code>, e.g. <code>@shot</code>. The <b>Begin/Edit Context Options Block</b> LOPs set them for part of a network. Shot Builder uses this to switch shots.` },
      { t: 'info', h: 'Key takeaways', p: `• LOPs cook one frame at a time. The USD ROP writes the samples for every frame<br>• Flush each frame for memory. <code>$F</code> in the path gives a file per frame<br>• Stitch Clips, File Cache, USD Zip, and context options (<code>@name</code>)` },
    ]},
    { id: 's10d1', kind: 'drill', title: 'Output drill', steps: [
      { t: 'mcq', q: 'Animated SOP Import with "Flush Data After Each Frame" off and no $F in the path gives…', o: ['One file with all samples (more memory while writing)', 'One file per frame', 'Nothing', 'A value clip'], a: 0, why: 'Frames are stitched in memory into one file.' },
      { t: 'tf', q: 'In-memory LOP layers hold every frame of animation at once.', a: false, why: 'They hold one time sample for the current frame.' },
      { t: 'mcq', q: 'Reference a context option named "shot" in an expression:', o: ['$shot', '@shot', '%shot', '{shot}'], a: 1, why: '@optionname.' },
      { t: 'mcq', q: 'Where do custom output processors live?', o: ['husdplugins/outputprocessors on the Houdini path', '$HIP/otls', 'USD_PLUGINPATH only', 'Inside the .hip'], a: 0, why: 'husdplugins/outputprocessors/.' },
    ]},
  ]
});

// ------------------------------------------------------------ S11
UNITS.push({
  id: 's11', part: 'p5', title: 'SCRIPTING SOLARIS', sub: 'Python Script LOP, VEX, Inline USD', emoji: '⌨️', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 's11l1', kind: 'lesson', title: 'Python Script LOP', steps: [
      { t: 'info', h: 'Full USD API inside a node', lang: 'py', code: `from pxr import UsdGeom\nnode = hou.pwd()\nstage = node.editableStage()\n\ncube = UsdGeom.Cube.Define(stage, '/shapes/cube1')\ncube.GetSizeAttr().Set(1.5)\n\nfor prim in stage.Traverse():\n    pass  # read or edit`, p: 'The <b>Python Script LOP</b> gives you the full pxr API on the node\'s stage:', after: `<code>hou.pwd().editableStage()</code> returns an editable <code>Usd.Stage</code> for this node's output. Its edit target is <b>already set to the active layer</b>. <b>Don't change it</b>.` },
      { t: 'info', h: 'Rules for fast scripts', p: `1. <b>Read first</b>: read from the input with <code>node.inputs()[0].stage()</code>, evaluate patterns, stash values…<br>2. <b>then</b> call <code>editableStage()</code> and write.<br><br>Mixing reads and writes in the wrong order still works but forces Houdini to recompose extra stages, which is slow.<br><br>• Need raw layer access? <code>node.editableLayer()</code> gives an <code>Sdf.Layer</code> (don't also call editableStage() in the same script).<br>• Wrap bulk Sdf edits in <code>Sdf.ChangeBlock()</code>.` },
      { t: 'mcq', q: 'In a Python Script LOP, which gives you a stage you can modify?', o: ['hou.pwd().stage()', 'hou.pwd().editableStage()', 'Usd.Stage.Open()', 'hou.LopNode.save()'], a: 1, why: 'editableStage() returns this node\'s editable output stage.' },
      { t: 'tf', q: 'It\'s fine to call stage.SetEditTarget() inside a Python Script LOP.', a: false, why: 'Houdini sets the edit target to the active layer. Changing it gives unpredictable results.' },
      { t: 'info', h: 'Patterns from Python', lang: 'py', code: `node = hou.pwd()\nls = hou.LopSelectionRule()\nls.setPathPattern('%type:Light')\npaths = ls.expandedPaths(node.inputs()[0])   # read first\n\nstage = node.editableStage()                 # then write\nfor p in paths:\n    stage.GetPrimAtPath(p).GetAttribute('inputs:exposure').Set(-1)`, p: 'Use <b>hou.LopSelectionRule</b> to evaluate Houdini prim patterns instead of hand-written traversals:' },
      { t: 'info', h: 'Elsewhere in Houdini', p: `• <code>hou.LopNode.stage()</code>: read-only stage of any LOP, e.g. in a shelf tool or a parameter expression. <code>editableStage()</code> only works inside a Python Script LOP.<br>• Add <b>spare parameters</b> to a Python Script LOP and read them with <code>node.evalParm('primpath')</code>, then turn it into an HDA to share.` },
      { t: 'info', h: 'Key takeaways', p: `• <code>hou.pwd().editableStage()</code> (edit target preset, so don't touch it)<br>• Read inputs first, then write. <code>hou.LopSelectionRule</code> for patterns<br>• <code>hou.LopNode.stage()</code> = read-only access anywhere` },
    ]},
    { id: 's11l2', kind: 'lesson', title: 'VEX & Inline USD', steps: [
      { t: 'info', h: 'Attribute Wrangle LOP', p: `VEX in LOPs runs <b>once per matched prim</b> (or, in array mode, once per <b>array element</b>, e.g. per point-instance). Read and write attributes with <code>@</code>:`, lang: 'vex', code: `// runs on each prim matching the Primitives pattern\nif (@primtype == "Sphere")\n    @radius *= 2;\nusd_setprimvar(0, @primpath, "wetness", rand(@elemnum));`, after: `Built-ins: <code>@primpath</code>, <code>@primname</code>, <code>@primtype</code>, <code>@primkind</code>, <code>@primpurpose</code>, <code>@primactive</code>, <code>@primvisible</code>, <code>@elemnum</code>, <code>@numelem</code>.` },
      { t: 'info', h: 'usd_* functions', p: `A big VEX library mirrors the USD API:<br>• create: <code>usd_addprim</code>, <code>usd_addattrib</code>, <code>usd_addprimvar</code>, <code>usd_applyapi</code><br>• read/write: <code>usd_attrib</code>/<code>usd_setattrib</code>, <code>usd_primvar</code>/<code>usd_setprimvar</code>, <code>usd_setmetadata</code><br>• state: <code>usd_setkind</code>, <code>usd_setactive</code>, <code>usd_setpurpose</code>, <code>usd_setvisible</code><br>• xforms: <code>usd_addtranslate</code>, <code>usd_addrotate</code>, <code>usd_settransformorder</code>, <code>usd_worldtransform</code><br>• variants and collections: <code>usd_setvariantselection</code>, <code>usd_addcollectioninclude</code><br>• materials: <code>usd_bindmaterial</code>, <code>usd_boundmaterialpath</code>` },
      { t: 'mcq', q: 'In an Attribute Wrangle LOP, the current prim\'s path is…', o: ['@ptnum', '@primpath', '@path', '@P'], a: 1, why: '@primpath.' },
      { t: 'mcq', q: 'Select a variant from VEX:', o: ['usd_setvariantselection', 'usd_setvariant', 'setvariant', 'usd_variant'], a: 0, why: 'usd_setvariantselection.' },
      { t: 'info', h: 'Python vs VEX', p: `• Reading a stage can be multithreaded, but <b>writing is single-threaded</b><br>• SideFX recommends <b>Python over VEX for LOP performance</b>. VEX is more convenient when mixing SOP and USD data.<br><br><b>Inline USD LOP</b>: paste raw <code>.usda</code> text and it's parsed and added to the layer stack. It's perfect for quick tests and for reproducing bugs.` },
      { t: 'tf', q: 'The Inline USD LOP lets you type .usda text directly into the network.', a: true, why: 'It parses usda and adds it to the layer stack.' },
      { t: 'info', h: 'Key takeaways', p: `• Wrangle runs per prim (or per array element). <code>@primpath</code> etc.<br>• The <code>usd_*</code> VEX functions cover create, read/write, xforms, variants, collections and materials<br>• Python is usually faster for LOPs. Inline USD for raw usda` },
    ]},
    { id: 's11d1', kind: 'drill', title: 'Scripting drill', steps: [
      { t: 'order', q: 'Order a well-behaved Python Script LOP.', items: ['node = hou.pwd()', 'paths = rule.expandedPaths(node.inputs()[0])', 'stage = node.editableStage()', 'edit prims at paths'], why: 'Read inputs and patterns first, then get the editable stage and write.' },
      { t: 'mcq', q: 'Read-only access to a LOP\'s stage from a shelf script:', o: ['hou.node(path).stage()', 'hou.node(path).editableStage()', 'Usd.Stage.Open(path)', 'hou.lop()'], a: 0, why: 'stage() is read-only. editableStage() is only for Python Script LOPs.' },
      { t: 'fill', q: 'Double every sphere\'s radius.', lang: 'vex', code: `if (@▢ == "Sphere")\n    @radius *= 2;`, blanks: ['primtype'], extra: ['primpath', 'type', 'kind'], why: '@primtype holds the type name.' },
    ]},
  ]
});

// ------------------------------------------------------------ S12
UNITS.push({
  id: 's12', part: 'p5', title: 'SHOT BUILDER', sub: 'Multi-shot projects (H21+)', emoji: '🎞️', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 's12l1', kind: 'lesson', title: 'Projects & units', steps: [
      { t: 'info', h: 'A pipeline in a box', p: `<b>Shot Builder</b> (added in Houdini 21, still marked <b>beta</b>) gives small teams a multi-shot USD workflow without a full studio pipeline.<br><br>It's built on a custom asset resolver, the <b>HPR (Houdini Path Resolver)</b>, which organises project layers and <b>versions them automatically</b>.` },
      { t: 'info', h: 'Project setup', p: `1. Save your .hip, then open <b>New Pane Tab ▸ Solaris ▸ Shot Builder Project</b><br>2. <b>New Project</b> → choose "Shots with Sublayers" (collaboration) or "No Sublayers" (solo)<br>3. Save the generated <code>project.json</code>. Its folder becomes the <b>project root</b><br><br><code>project.json</code> defines fps, frame ranges, the sublayer format, version padding and <b>unit templates</b> (e.g. <code>shot</code> named like <code>s%04d</code>, <code>env</code>), each with a map of department <b>sublayers</b> such as <code>./lighting.usda</code>.` },
      { t: 'mcq', q: 'What does Shot Builder\'s HPR resolver add on top of plain file paths?', o: ['Automatic versioning of layers', 'GPU rendering', 'Material translation', 'Compression'], a: 0, why: 'HPR organises and versions project layers automatically.' },
      { t: 'info', h: 'Versioned paths', p: `Writing <code>hpr:folder/layer.usd</code> creates <code>…/folder/layer.usd/layer_v1.usd</code>, then v2, v3… on later saves.<br><br>• <b>Reads</b> default to the <b>highest</b> version<br>• Pin one with <code>hpr:folder/layer.usd?v=2</code><br>• Relative sublayers inside HPR layers are versioned too<br>• <code>non_versioned_folders</code> in project.json lists exceptions` },
      { t: 'mcq', q: '<code>hpr:shots/s0010/lighting.usda?v=3</code> resolves to…', o: ['The latest lighting version', 'Version 3 of the lighting layer', 'Frame 3', 'An error'], a: 1, why: '?v= pins a specific version.' },
      { t: 'info', h: 'Key takeaways', p: `• Shot Builder = beta multi-shot workflow on the <b>HPR</b> versioning resolver<br>• <code>project.json</code>: units (shot/env…) + department sublayers<br>• <code>hpr:path</code> reads the latest version, <code>?v=N</code> pins one` },
    ]},
    { id: 's12l2', kind: 'lesson', title: 'Shot nodes', steps: [
      { t: 'info', h: 'The nodes', p: `• <b>Shot Load</b>: the entry point. Loads the current shot's unit layer (e.g. <code>hpr:shot/s0010/shot.usda</code>) and can pin layer versions<br>• <b>Shot Layer Edit</b>: targets edits at a specific department layer, for all shots matching a pattern<br>• <b>Shot Split</b> + <b>Shot Switch</b>: fan the network out per shot or per group, then recombine based on the current shot context option<br>• <b>Shot Output</b>: Publish (USD), Render (images), or both. Multi-Shot takes a shot pattern` },
      { t: 'match', q: 'Match the node.', pairs: [['Shot Load', 'Entry point, loads shot layer'], ['Shot Layer Edit', 'Edit a target layer for matching shots'], ['Shot Switch', 'Pick a branch by shot context'], ['Shot Output', 'Publish and/or render']] },
      { t: 'tf', q: 'Shot Output can publish USD for several shots in one go.', a: true, why: 'Its Multi-Shot parameter takes a shot pattern.' },
      { t: 'info', h: 'Key takeaways', p: `• Load → Layer Edit (with Split/Switch for per-shot tweaks) → Output<br>• The current shot comes from a context option, which is why Switch works` },
    ]},
    { id: 's12c1', kind: 'challenge', title: 'Solaris final boss', timed: true, steps: [
      { t: 'mcq', q: 'Each LOP outputs…', o: ['SOP geometry', 'A composed USD stage', 'An image'], a: 1, why: 'A stage.' },
      { t: 'mcq', q: 'Edits normally go into…', o: ['The disk layer', 'The active (strongest in-memory) layer', 'The session layer'], a: 1, why: 'Active layer.' },
      { t: 'mcq', q: 'Save only the edits after loading context:', o: ['Layer Break', 'Merge', 'Graft'], a: 0, why: 'Layer Break.' },
      { t: 'mcq', q: '<code>/* - /a /b</code> includes /b?', o: ['Yes', 'No'], a: 0, why: 'Left-to-right: (/* - /a) + /b.' },
      { t: 'mcq', q: 'Component Builder root kind:', o: ['component', 'assembly', 'group'], a: 0, why: 'component.' },
      { t: 'mcq', q: 'Layout LOP\'s new name (H22):', o: ['Paint Instances', 'Scatter', 'Stage Manager'], a: 0, why: 'Paint Instances.' },
      { t: 'tf', q: 'Karma XPU renders VEX shaders.', a: false, why: 'Never.' },
      { t: 'mcq', q: 'Recommended H22 render setup:', o: ['Karma LOP', 'Karma Render Settings + USD Render ROP', 'Mantra'], a: 1, why: 'Karma LOP is deprecated.' },
      { t: 'mcq', q: 'A $F in a save path gives…', o: ['One file per frame', 'One file'], a: 0, why: 'Per frame.' },
      { t: 'mcq', q: 'Editable stage in a Python Script LOP:', o: ['hou.pwd().editableStage()', 'hou.pwd().stage()'], a: 0, why: 'editableStage().' },
      { t: 'mcq', q: 'Houdini vertex attribute → USD interpolation:', o: ['vertex', 'faceVarying', 'uniform'], a: 1, why: 'faceVarying.' },
    ]},
  ]
});

// ------------------------------------------------------------ GLOSSARY
const GLOSSARY = [
  ['Stage', 'The composed scene you query: all layers and arcs resolved together.'],
  ['Layer', 'A file (or in-memory doc) of opinions. .usda / .usdc / anonymous.'],
  ['Opinion', 'Any value or metadata authored in a layer. The strongest opinion wins.'],
  ['Prim', 'A node in the scene namespace. Has a specifier, type, name, properties.'],
  ['PrimSpec', 'One layer\'s uncomposed description of a prim (Sdf level).'],
  ['Attribute', 'A typed, optionally time-sampled value on a prim.'],
  ['Relationship', 'A property that targets other paths (e.g. material:binding). List-edited.'],
  ['Metadata', 'Name/value info on layers, prims or properties. Never animated.'],
  ['customData / assetInfo', 'Free-form dictionary metadata / asset identity (identifier, name, version).'],
  ['Path', 'Address in namespace: /World/Ball, or /World/Ball.radius for a property.'],
  ['Pseudo-root', 'The hidden root prim "/" above all root prims.'],
  ['Specifier', 'def (defines), over (overrides only), class (abstract template).'],
  ['Active', 'Metadata. active = false removes a prim and its subtree from the stage.'],
  ['Visibility', 'Attribute: inherited or invisible. Can be animated; prims still exist.'],
  ['Schema (IsA / typed)', 'The one type a prim has, e.g. Mesh, Xform. Gives built-in properties.'],
  ['API schema', '"Has-a" mix-in applied via apiSchemas. Single- or multiple-apply.'],
  ['Fallback', 'A schema\'s default value used when nothing is authored.'],
  ['Variability', 'varying (default) or uniform (not meant to be animated).'],
  ['Attribute block', 'Authoring None to hide all weaker opinions of an attribute.'],
  ['Time code', 'Unitless time value. timeCodesPerSecond maps it to seconds.'],
  ['Time sample', 'A value at a time code. Linear interpolation by default, held outside range.'],
  ['Value resolution', 'Per opinion, strongest first: samples → splines → default → clips → fallback.'],
  ['Sublayer', 'Stacks whole layers on the same paths. Earlier in the list = stronger.'],
  ['LayerStack', 'A layer plus all its sublayers, in strength order. Composes as "Local".'],
  ['Session layer', 'Strongest, unsaved scratch layer above the root layer.'],
  ['Edit target', 'Which layer Set() writes to. The root layer by default.'],
  ['Layer offset', 'Time offset/scale on a sublayer or reference. Composes multiplicatively.'],
  ['Flatten', 'Bake a composed stage into one layer with no arcs.'],
  ['Reference', 'Grafts a prim from another layer under a prim, with namespace remapping.'],
  ['defaultPrim', 'Layer metadata: the prim used when a reference names no prim.'],
  ['Payload', 'A deferred reference you can load or unload.'],
  ['VariantSet', 'Named alternatives. The selection is an opinion and can be overridden.'],
  ['Inherits', 'Pull opinions from a class. Stays live through references (broadcast).'],
  ['Specializes', 'Weakest arc: a base that only fills what the derived prim hasn\'t refined.'],
  ['Relocates', 'Non-destructive renames and moves of composed prims (the E in LIVERPS).'],
  ['LIVERPS', 'Local, Inherits, Variants, rElocates, References, Payloads, Specializes.'],
  ['List editing', 'prepend / append / delete / explicit edits to lists like arcs and targets.'],
  ['Prim index / PrimStack', 'Cached composition result per prim / its contributing specs in order.'],
  ['Path translation', 'Mapping paths between a referenced layer\'s namespace and the stage\'s.'],
  ['Gprim', 'Drawable geometry (Mesh, Sphere, Points…). Don\'t nest gprims.'],
  ['xformOpOrder', 'Ordered list of xform ops. The last op is applied to points first.'],
  ['!resetXformStack!', 'First entry in xformOpOrder that ignores parent transforms.'],
  ['upAxis / metersPerUnit', 'Layer metadata for orientation and units. Not auto-converted.'],
  ['Extent', 'Local bounding box on Boundable prims. extentsHint caches model bounds.'],
  ['Subdivision scheme', 'Mesh fallback is catmullClark. Normals are ignored when subdivided.'],
  ['GeomSubset', 'A subset of a mesh\'s faces, e.g. for per-face materials.'],
  ['Primvar', 'Surface-varying shader data: constant / uniform / varying / vertex / faceVarying.'],
  ['Indexed primvar', 'Unique values + :indices array.'],
  ['Kind', 'assembly › group › component › subcomponent. Never assign "model".'],
  ['Purpose', 'default / render / proxy / guide. Inherited down namespace.'],
  ['Instanceable', 'Prims with identical arcs share one prototype; descendants are read-only proxies.'],
  ['PointInstancer', 'Array-driven instancing: prototypes + protoIndices + positions…'],
  ['UsdShade', 'Material ⊃ NodeGraph ⊃ Shader, wired by inputs:/outputs: connections.'],
  ['Render context', 'outputs:surface (universal), outputs:mtlx:surface, outputs:ri:surface…'],
  ['Material binding', 'rel material:binding + MaterialBindingAPI. Inherited, closest wins.'],
  ['bindMaterialAs', 'weakerThanDescendants (default) or strongerThanDescendants.'],
  ['UsdLux', 'Lights = prims with LightAPI. Emit along −Z. intensity × 2^exposure.'],
  ['Light linking', 'collection:lightLink / collection:shadowLink on each light.'],
  ['Collection', 'Named prim set: includes/excludes/expansionRule or membershipExpression.'],
  ['UsdRender', 'RenderSettings › RenderProduct (file) › RenderVar (AOV).'],
  ['Asset resolver (Ar)', 'Turns @asset paths@ into locations. Relative paths anchor to the authoring layer.'],
  ['Value clips', 'Time samples spread across many files, stitched at read time.'],
  ['Hydra', 'USD\'s render architecture: scene delegate → render index → render delegate.'],
  ['Solaris / LOPs', 'Houdini\'s USD toolset; each LOP outputs a composed stage.'],
  ['Active layer (LOPs)', 'The strongest in-memory layer that LOP nodes write into.'],
  ['Layer Break', 'Starts a new active layer; earlier layers aren\'t written to disk.'],
  ['Prim pattern', 'Houdini selection syntax: * ** ? [] %type: %kind: & - ~ { vex }.'],
  ['Component Builder', 'Geometry → Material Library → Component Material → Component Output.'],
  ['Paint Instances', 'H22 name for the Layout LOP: brush assets in as point instances.'],
  ['Karma CPU / XPU', 'Houdini\'s USD path tracer; XPU uses GPU and has no VEX shaders.'],
  ['husk', 'Karma\'s command-line USD renderer.'],
  ['HPR', 'Houdini Path Resolver used by Shot Builder to version layers.'],
];
