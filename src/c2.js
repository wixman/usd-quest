// ============================================================
//  PART 2: COMPOSITION
// ============================================================

// ------------------------------------------------------------ U7
UNITS.push({
  id: 'u7', part: 'p2', title: 'LAYERS', sub: 'Layer stacks, strength, edit targets', emoji: '📚', color: '#ff4b4b', shadow: '#d63a3a',
  items: [
    { id: 'u7l1', kind: 'lesson', title: 'Sublayers & strength', steps: [
      { t: 'info', h: 'Composition, in one sentence', p: `<b>Composition</b> is how USD combines many layers into one stage, using <b>composition arcs</b>, the operators that link layers and prims together. There are only a handful: <b>subLayers, inherits, variantSets, relocates, references, payloads, specializes</b>.<br><br>The simplest one is <b>subLayers</b>, so we start there.` },
      { t: 'info', h: 'subLayers', p: `A layer can stack other whole layers <b>underneath itself</b>:`, lang: 'usda', code: `#usda 1.0\n(\n    subLayers = [\n        @./lighting.usda@,\n        @./anim.usda@,\n        @./layout.usda@\n    ]\n)`, after: `All of these layers describe the <b>same paths</b>, so <code>/World/Car</code> in lighting.usda and <code>/World/Car</code> in layout.usda are the same prim. Sublayers are like stacked Photoshop layers covering the same canvas.` },
      { t: 'info', h: 'Who wins?', p: `In the <code>subLayers</code> list, the <b>first</b> layer is the <b>strongest</b>. The layer doing the sublayering (here the root layer) is stronger than all of its sublayers.<br><br>Sublayers can have their own sublayers. The whole flattened, ordered list is called a <b>LayerStack</b>.<br><br><b>root › lighting › anim › layout</b>` },
      { t: 'widget', w: 'layerStack', h: 'Layer stack lab', p: 'Reorder and mute layers. Each property shows which layer won.' },
      { t: 'mcq', q: 'layout.usda says ball colour = blue. fx.usda says red. Root: <code>subLayers = [@fx.usda@, @layout.usda@]</code>. Result?', o: ['blue', 'red', 'purple', 'error'], a: 1, why: 'fx is listed first, so it\'s stronger.' },
      { t: 'tf', q: 'Opinions are resolved per property, not per prim.', a: true, why: 'One layer can win radius while another wins colour on the same prim.' },
      { t: 'info', h: 'Key takeaways', p: `• Composition arcs link layers. subLayers is the simplest<br>• First in the list = strongest. The root beats its sublayers<br>• The ordered result is a <b>LayerStack</b>, and opinions resolve per property` },
    ]},
    { id: 'u7l2', kind: 'lesson', title: 'Root & session layers', steps: [
      { t: 'info', h: 'The root layer', p: `The file you open is the stage's <b>root layer</b>. Everything else is pulled in from there.<br><br>On top of the root sits the <b>session layer</b>: an in-memory scratch layer, <b>stronger than everything</b> in the root layer stack. Viewers like usdview store temporary things there: which variant you clicked, what you hid, what you deactivated.` },
      { t: 'info', h: 'Session layer rules', p: `• <code>stage.Save()</code> does <b>not</b> save the session layer<br>• Root layer stack + session layer stack = the <b>root LayerStack</b> of the stage<br>• Use it for "try this without touching any file" edits` },
      { t: 'order', q: 'Strongest → weakest.', items: ['session layer', 'root layer', 'first sublayer', 'last sublayer'], why: 'Session on top, then root, then sublayers in list order.' },
      { t: 'mcq', q: 'Where do temporary, unsaved viewport tweaks usually go?', o: ['Root layer', 'Session layer', 'Weakest sublayer', 'A payload'], a: 1, why: 'The session layer is the strongest and isn\'t saved by stage.Save().' },
      { t: 'info', h: 'Anonymous layers', p: `Layers don't have to exist on disk. <b>Anonymous layers</b> live only in memory and get identifiers like <code>anon:0x7f…</code>. <code>Usd.Stage.CreateInMemory()</code> gives you one as the root.<div class="hou">🟠 <b>Houdini:</b> LOP nodes author into anonymous in-memory layers until you write them out. That's covered in the Solaris chapters.</div>` },
      { t: 'info', h: 'Key takeaways', p: `• You open the <b>root layer</b>. The <b>session layer</b> sits above it, strongest and unsaved<br>• Anonymous layers exist only in memory` },
    ]},
    { id: 'u7l3', kind: 'lesson', title: 'Edit targets & offsets', steps: [
      { t: 'info', h: 'Where do edits go?', p: `When you call <code>attr.Set(5)</code>, USD writes an opinion into the stage's <b>EditTarget</b>, which is the <b>root layer</b> by default.<br><br>You can retarget edits to any layer in the stack (or even inside a variant, or the target of a reference):`, lang: 'py', code: `fx = Sdf.Layer.FindOrOpen('fx.usda')\nstage.SetEditTarget(fx)\nball.GetAttribute('radius').Set(5)   # written into fx.usda\n\nstage.SetEditTarget(stage.GetSessionLayer())`, after: 'It\'s like choosing which Photoshop layer your brush paints on.' },
      { t: 'mcq', q: 'You call attr.Set(1) on a freshly opened stage. Which layer receives the opinion?', o: ['The strongest sublayer', 'The session layer', 'The root layer', 'A new layer'], a: 2, why: 'By default the edit target is the root layer.' },
      { t: 'info', h: 'Layer offsets', p: `A sublayer (or reference) can <b>shift and scale time</b> for everything it brings in:`, lang: 'usda', code: `subLayers = [\n    @./anim.usda@ (offset = 10; scale = 2)\n]`, after: `Offsets <b>compose</b> along chains: a scale of 2 inside a reference with scale 3.5 gives 7. This is how you reuse a walk cycle starting at a different frame without re-exporting it.` },
      { t: 'mcq', q: 'Shift an animation sublayer so it plays 10 frames later:', o: ['(offset = 10)', '(scale = 10)', '(start = 10)', '(time = +10)'], a: 0, why: 'Layer offsets have offset and scale.' },
      { t: 'info', h: 'Muting & flattening', p: `• <b>Mute</b> a layer to ignore it temporarily: <code>stage.MuteLayer(layer.identifier)</code><br>• <b>Flatten</b> bakes the composed stage into <b>one layer with no arcs left</b>: <code>stage.Flatten()</code>, <code>stage.Export('baked.usda')</code>, or <code>usdcat --flatten</code>. It's great for delivery and debugging, but you lose all the collaboration structure, and text output can get huge.<br>• <b>Localize</b> (used when building .usdz) copies all dependencies and retargets paths <b>without</b> flattening.` },
      { t: 'mcq', q: 'What does flattening remove?', o: ['Prims', 'Time samples', 'Composition arcs / layer structure', 'Materials'], a: 2, why: 'You get one layer with final values. Every arc is resolved away.' },
      { t: 'info', h: 'Key takeaways', p: `• The <b>EditTarget</b> picks the layer Set() writes into (the root by default)<br>• <b>Layer offsets</b> shift and scale time, and compose multiplicatively<br>• <b>Mute</b> temporarily, <b>flatten</b> to bake, <b>localize</b> to package` },
    ]},
    { id: 'u7d1', kind: 'drill', title: 'Layer drill', steps: [
      { t: 'order', q: 'subLayers = [@a@, @b@, @c@]. Strongest → weakest (with root).', items: ['root', 'a', 'b', 'c'], why: 'Root beats its sublayers, which go in list order.' },
      { t: 'fill', q: 'Send edits to the fx layer.', lang: 'py', code: `fx = Sdf.Layer.FindOrOpen('fx.usda')\nstage.▢(fx)`, blanks: ['SetEditTarget'], extra: ['SetLayer', 'MuteLayer', 'Flatten'], why: 'stage.SetEditTarget(layer)' },
      { t: 'tf', q: 'stage.Save() writes the session layer to disk.', a: false, why: 'The session layer is never saved by Save().' },
      { t: 'match', q: 'Match.', pairs: [['Mute', 'Ignore a layer temporarily'], ['Flatten', 'Bake to one layer'], ['Edit target', 'Where Set() writes'], ['Session', 'Strongest scratch layer']] },
      { t: 'mcq', q: 'A reference has scale = 2, and inside it a sublayer has scale = 3. Effective scale?', o: ['5', '6', '3', '2'], a: 1, why: 'Offsets compose multiplicatively.' },
      { t: 'tf', q: 'Two sublayers can each win different properties of the same prim.', a: true, why: 'Resolution is per property.' },
    ]},
  ]
});

// ------------------------------------------------------------ U8
UNITS.push({
  id: 'u8', part: 'p2', title: 'REFERENCES & PAYLOADS', sub: 'Bringing assets in', emoji: '🔗', color: '#ff4b4b', shadow: '#d63a3a',
  items: [
    { id: 'u8l1', kind: 'lesson', title: 'References', steps: [
      { t: 'info', h: 'Graft an asset', p: `Sublayers stack whole layers on the <b>same paths</b>. A <b>reference</b> is different: it takes a prim (and its children) from another layer and <b>grafts it onto a prim in your scene</b>, under a new name.`, lang: 'usda', code: `def Xform "Tree_01" (\n    prepend references = @./assets/tree.usda@</Tree>\n)\n{\n    double3 xformOp:translate = (4, 0, 2)\n    uniform token[] xformOpOrder = ["xformOp:translate"]\n}` },
      { t: 'info', h: 'Namespace remapping', p: `In tree.usda the tree lives at <code>/Tree</code>, with a child <code>/Tree/Trunk</code>. After the reference above, the stage shows it at <code>/World/Tree_01</code> and <code>/World/Tree_01/Trunk</code>.<br><br>The referenced prim's name <b>disappears</b>, and the referencing prim takes its place. USD translates paths both ways (this is called <b>path translation</b>), including relationship targets inside the asset.` },
      { t: 'mcq', q: 'tree.usda has /Tree/Trunk. It\'s referenced onto /World/Oak. Where does Trunk appear?', o: ['/Tree/Trunk', '/World/Oak/Trunk', '/World/Tree/Trunk', '/World/Oak/Tree/Trunk'], a: 1, why: 'The target prim maps onto the referencing prim.' },
      { t: 'info', h: 'defaultPrim & internal references', p: `Leave off the <code>&lt;/Tree&gt;</code> part and USD uses the file's <b>defaultPrim</b> metadata. That's why every asset file should set one.<br><br>Leave off the <b>file</b> and you get an <b>internal reference</b> to a prim in the same layer stack: <code>references = &lt;/Library/Chair&gt;</code>.` },
      { t: 'tap', q: 'Tap the part that\'s optional if tree.usda has a defaultPrim.', code: `prepend references = ⟦@./tree.usda@⟧⟦</Tree>⟧`, a: 1, why: 'Without a prim path, the defaultPrim is used.' },
      { t: 'info', h: 'Local opinions win', p: `Anything you author <b>directly on the referencing prim</b> (or its descendants) in your layer stack is stronger than what's inside the referenced asset. So you can move, recolour or tweak each copy of an asset individually.<br><br>Also: reference the same file 1,000 times and it's still <b>opened only once</b>. Layers are shared.` },
      { t: 'tf', q: 'A colour authored on the referencing prim beats the colour inside the referenced asset.', a: true, why: 'Local opinions are stronger than referenced ones.' },
      { t: 'info', h: 'Key takeaways', p: `• A reference grafts a prim subtree under a new name (<b>namespace remapping</b>)<br>• No prim path → <b>defaultPrim</b>. No file → <b>internal reference</b><br>• Local opinions beat referenced ones. Files are loaded once and shared` },
    ]},
    { id: 'u8l2', kind: 'lesson', title: 'Payloads', steps: [
      { t: 'info', h: 'References you can unload', p: `A <b>payload</b> is a reference that's <b>deferred</b>: its contents are only composed when you <b>load</b> it. Put heavy geometry behind payloads, and you can open a huge city in a second and load just the block you need.`, lang: 'usda', code: `def Xform "City_Block" (\n    prepend payload = @./block_geo.usdc@\n)\n{}` },
      { t: 'widget', w: 'refVsPayload', h: 'Load what you need', p: 'Toggle payloads and watch memory. References can\'t be unloaded.' },
      { t: 'info', h: 'Loading in Python', lang: 'py', code: `stage = Usd.Stage.Open('city.usda', Usd.Stage.LoadNone)\nstage.Load('/World/City_Block_03')\nstage.Unload('/World/City_Block_03')\nprint(stage.GetLoadSet())`, p: 'Open with nothing loaded, then load one block:', after: 'Unloading also unloads any payloads nested below. In Pixar\'s pipeline, payloads usually sit on <b>component asset roots</b>.' },
      { t: 'mcq', q: 'A prim\'s payload is unloaded. What do you still see?', o: ['Nothing; the prim is gone', 'The prim itself and its local opinions, but not the payload\'s contents', 'Everything, in low res', 'An error'], a: 1, why: 'The prim exists. The payload\'s contribution just isn\'t composed.' },
      { t: 'info', h: 'Bounds while unloaded', p: `If an unloaded asset vanished completely, layout artists couldn't see where things are. So model roots can store an <b>extentsHint</b> (a cached bounding box, from UsdGeomModelAPI) that viewers draw as a box while the payload is unloaded.` },
      { t: 'tf', q: 'Payloads are stronger than references.', a: false, why: 'Within a layer stack, payloads are weaker than direct references (R before P in the strength order).' },
      { t: 'info', h: 'Key takeaways', p: `• A payload is a deferred, loadable/unloadable reference<br>• <code>Stage.Open(path, Usd.Stage.LoadNone)</code> then <code>Load()</code>/<code>Unload()</code><br>• Put payloads on component roots, and use extentsHint so unloaded assets still show a box` },
    ]},
    { id: 'u8d1', kind: 'drill', title: 'Reference drill', steps: [
      { t: 'fill', q: 'Reference the asset\'s default prim.', lang: 'usda', code: `def "Chair_01" (\n    ▢ references = ▢\n)\n{}`, blanks: ['prepend', '@./chair.usda@'], extra: ['append', '</chair.usda>', '"chair.usda"'], why: 'prepend references = @file@' },
      { t: 'mcq', q: 'Open a 10 GB set instantly, then load only what the camera sees. Which arc?', o: ['Inherits', 'Payloads', 'Specializes', 'Sublayers'], a: 1, why: 'Payloads are the loadable arc.' },
      { t: 'mcq', q: '<code>references = &lt;/Library/Chair&gt;</code> (no file) is a…', o: ['Broken reference', 'Internal reference', 'Payload', 'Sublayer'], a: 1, why: 'No asset path means a prim in the same layer stack.' },
      { t: 'tf', q: 'If you reference the same file 50 times, it\'s opened 50 times.', a: false, why: 'Layers are cached and shared.' },
      { t: 'mcq', q: 'Which helps viewers draw a box for an unloaded asset?', o: ['extentsHint', 'defaultPrim', 'kind', 'purpose'], a: 0, why: 'UsdGeomModelAPI extentsHint caches model bounds.' },
    ]},
  ]
});

// ------------------------------------------------------------ U9
UNITS.push({
  id: 'u9', part: 'p2', title: 'VARIANTS', sub: 'Switchable alternatives', emoji: '🔀', color: '#ff4b4b', shadow: '#d63a3a',
  items: [
    { id: 'u9l1', kind: 'lesson', title: 'Variant sets', steps: [
      { t: 'info', h: 'What variants are', p: `A <b>variantSet</b> is a named group of alternatives on a prim. Each <b>variant</b> inside it is a bundle of opinions: overrides, extra child prims, even more composition arcs. A <b>selection</b> picks which one is active.<br><br>Typical uses are looks (clean/dirty), levels of detail (high/low), and geometry options (with/without hat).` },
      { t: 'info', h: 'Syntax', lang: 'usda', code: `def Xform "Car" (\n    variants = { string paint = "red" }\n    prepend variantSets = "paint"\n)\n{\n    variantSet "paint" = {\n        "red"  { color3f[] primvars:displayColor = [(0.9,0.1,0.1)] }\n        "blue" { color3f[] primvars:displayColor = [(0.1,0.3,0.9)] }\n    }\n}`, p: 'Three pieces work together:', after: `• <code>variantSets = "paint"</code>: declares that the set exists (a list op)<br>• <code>variantSet "paint" = { … }</code>: the contents of each variant<br>• <code>variants = { string paint = "red" }</code>: the <b>selection</b>` },
      { t: 'widget', w: 'variantSwitch', h: 'Switch variants', p: 'Pick a selection in each variant set. Then turn on the shot override.' },
      { t: 'info', h: 'The selection is just an opinion', p: `<code>variants = { string paint = "blue" }</code> is an ordinary metadata opinion. That means a <b>stronger layer can override the selection</b> with an <code>over</code>. Shots switch asset looks this way without touching the asset file.<br><br>If <b>no selection</b> is made, the variant set contributes <b>nothing</b>.` },
      { t: 'mcq', q: 'The asset selects paint = "red". The stronger shot layer has <code>over "Car" (variants = {string paint = "blue"})</code>. Result?', o: ['red', 'blue', 'Both', 'Error: conflicting selections'], a: 1, why: 'The stronger selection opinion wins.' },
      { t: 'tf', q: 'A variant set with no selection applies its first variant.', a: false, why: 'No selection means nothing from that set is applied.' },
      { t: 'info', h: 'Key takeaways', p: `• variantSet = named alternatives. variant = a bundle of opinions<br>• <code>variants = {…}</code> is the selection, and it's overridable by stronger layers<br>• No selection = no contribution` },
    ]},
    { id: 'u9l2', kind: 'lesson', title: 'Advanced variants', steps: [
      { t: 'info', h: 'Many sets, nesting & order', p: `• A prim can have <b>many</b> variant sets. Their order in <code>variantSets</code> decides which is stronger if they disagree.<br>• Variants can contain <b>nested</b> variant sets (e.g. a <code>lod</code> set inside each <code>look</code> variant).<br>• Downstream layers can even <b>add new variants</b> to an existing set.` },
      { t: 'info', h: 'Authoring in Python', lang: 'py', code: `vsets = prim.GetVariantSets()\nvset = vsets.AddVariantSet('lod')\nvset.AddVariant('high')\nvset.AddVariant('low')\n\nvset.SetVariantSelection('high')\nwith vset.GetVariantEditContext():\n    # everything authored here goes INSIDE the "high" variant\n    UsdGeom.Mesh.Define(stage, prim.GetPath().AppendChild('Body'))`, p: 'To author <b>inside</b> a variant, select it and open its edit context:', after: 'Forget the edit context and your opinions land outside the variant, applying to every variant.' },
      { t: 'fill', q: 'Author into a variant.', lang: 'py', code: `vset = prim.GetVariantSets().AddVariantSet('lod')\nvset.AddVariant('high')\nvset.▢('high')\nwith vset.▢():\n    ...`, blanks: ['SetVariantSelection', 'GetVariantEditContext'], extra: ['Select', 'EditVariant', 'GetEditTarget'], why: 'Select the variant, then author inside its edit context.' },
      { t: 'info', h: 'Variants vs purpose', p: `Variants are great for <i>choices</i>, but only <b>one variant per set is composed at a time</b>. For "show a light proxy in the viewport but render the full model" you want <b>purpose</b> (proxy/render), because both exist side by side. You'll learn purpose in Part 3.<div class="hou">🟠 <b>Houdini:</b> the <b>Add Variant</b>, <b>Set Variant</b> and <b>Explore Variants</b> LOPs, plus <b>Create LOD</b> and <b>Auto Select LOD</b>, are built on exactly this.</div>` },
      { t: 'tf', q: 'Opinions authored outside the variant edit context apply regardless of the selection.', a: true, why: 'They aren\'t inside any variant.' },
      { t: 'info', h: 'Key takeaways', p: `• Many sets per prim. Nesting and downstream additions are allowed<br>• Use <code>GetVariantEditContext()</code> to author inside a variant<br>• One variant per set at a time, so use purpose for proxy/render pairs` },
    ]},
    { id: 'u9d1', kind: 'drill', title: 'Variant drill', steps: [
      { t: 'match', q: 'Match.', pairs: [['variantSets', 'Declares a set exists'], ['variantSet "x" = {…}', 'Variant contents'], ['variants = {…}', 'The selection']] },
      { t: 'tf', q: 'A variant can contain its own references and child prims.', a: true, why: 'Variants can hold any opinions, including arcs and subtrees.' },
      { t: 'mcq', q: 'Which arc lets a shot switch an asset from "clean" to "dirty"?', o: ['Payload', 'VariantSet selection', 'Specializes', 'Sublayer'], a: 1, why: 'Override the variant selection.' },
      { t: 'mcq', q: 'Show a lightweight stand-in in the viewport and the full model in renders, simultaneously. Best tool?', o: ['A variant set', 'Purpose (proxy + render)', 'Two stages', 'A payload'], a: 1, why: 'Only one variant composes at a time. Purpose keeps both.' },
    ]},
  ]
});

// ------------------------------------------------------------ U10
UNITS.push({
  id: 'u10', part: 'p2', title: 'INHERITS & FRIENDS', sub: 'Inherits, specializes, relocates', emoji: '🧬', color: '#ff4b4b', shadow: '#d63a3a',
  items: [
    { id: 'u10l1', kind: 'lesson', title: 'Inherits', steps: [
      { t: 'info', h: 'Broadcast edits', p: `<b>inherits</b> makes a prim pull in opinions from another prim, usually a <code>class</code>. Change the class once and <b>every inheritor updates</b>.`, lang: 'usda', code: `class "_class_Tree" { float leafHue = 0.3 }\n\ndef "Oak_01" (inherits = </_class_Tree>) {}\ndef "Oak_02" (inherits = </_class_Tree>) {}`, after: 'So far this looks like an internal reference. The magic is what happens next.' },
      { t: 'info', h: 'The magic: it stays live', p: `Imagine <code>tree.usd</code> inherits <code>/_class_Tree</code>, and your shot references 500 trees from it. In the <b>shot layer</b> you write:<br><br><code>over "_class_Tree" { float leafHue = 0.08 }</code><br><br>Every one of the 500 trees turns autumnal, <b>even though they came in through references</b>. Inherits look for the class in the <b>context where the asset is used</b>, so you can broadcast to all copies at once.` },
      { t: 'mcq', q: 'You want every tree in the shot autumnal with one edit, including trees brought in via references. Best arc?', o: ['References', 'Inherits', 'Payloads', 'Variants'], a: 1, why: 'Inherits broadcast from a class, and they re-root in the referencing context.' },
      { t: 'info', h: 'Rules of thumb', p: `• <b>Direct opinions</b> on an inheritor still beat the inherited ones, so one oak can stay green.<br>• Inherits have a runtime cost. Use them sparingly, typically <b>one class per asset root</b>.<div class="hou">🟠 <b>Houdini:</b> Component Builder creates a class prim and makes your asset root inherit it, ready for shot-level overrides.</div>` },
      { t: 'tf', q: 'A colour authored directly on Oak_01 beats the colour on the class it inherits.', a: true, why: 'Direct opinions win over inherited ones.' },
      { t: 'info', h: 'Key takeaways', p: `• Inherits pull opinions from a class and stay <b>live through references</b><br>• Override the class in the shot to change every copy<br>• Direct opinions on the inheritor still win` },
    ]},
    { id: 'u10l2', kind: 'lesson', title: 'Specializes & relocates', steps: [
      { t: 'info', h: 'Specializes: a weakest-possible base', p: `<b>specializes</b> also pulls opinions from a base prim, but with a twist: the specialized prim's own opinions <b>always win over the base</b>, in <b>any</b> context, even if a stronger layer edits the base.<br><br>Classic example: a material library where <code>BrushedMetal</code> specializes <code>Metal</code>. A shot that tweaks Metal's colour will flow into BrushedMetal, but it <b>can't</b> override the roughness that BrushedMetal itself refined.` },
      { t: 'mcq', q: 'BrushedMetal specializes Metal and sets roughness 0.6. A stronger shot layer sets Metal\'s roughness to 0.1. BrushedMetal\'s roughness?', o: ['0.1', '0.6', 'Average'], a: 1, why: 'Specializing prims\' refinements always beat the base.' },
      { t: 'mcq', q: 'Same setup, but BrushedMetal never set a colour. The shot makes Metal gold. BrushedMetal\'s colour?', o: ['Gold', 'Its old colour', 'Black'], a: 0, why: 'Unrefined values still flow in from the base.' },
      { t: 'info', h: 'Relocates', p: `<b>Relocates</b> are layer metadata that <b>rename or move</b> composed prims non-destructively, for example moving a character's <code>Hat</code> to sit under its <code>Head</code> in your shot:`, lang: 'usda', code: `#usda 1.0\n(\n    relocates = {\n        </Char/Hat>: </Char/Head/Hat>\n    }\n)`, after: `Rules: only prim paths, no root prims, and you must not author opinions at the old (source) path.<div class="hou">🟠 <b>Houdini:</b> there's a <b>Relocates LOP</b>.</div>` },
      { t: 'tf', q: 'Relocates can be used to rename a root prim like /World.', a: false, why: 'Root prims can\'t be relocated.' },
      { t: 'info', h: 'Key takeaways', p: `• <b>Specializes</b> = a base whose values only fill in what the derived prim hasn't refined<br>• <b>Relocates</b> = non-destructive renames and moves (not root prims)` },
    ]},
    { id: 'u10d1', kind: 'drill', title: 'Arc drill', steps: [
      { t: 'match', q: 'Match the arc.', pairs: [['Reference', 'Graft another layer\'s prim'], ['Payload', 'Deferred, unloadable reference'], ['Inherits', 'Broadcast from a class'], ['Specializes', 'Weakest base / fallback']] },
      { t: 'tf', q: 'Inherits only work inside the same file as the class.', a: false, why: 'They stay live through references, re-rooting in the using context.' },
      { t: 'mcq', q: 'Which arc rewrites namespace (moves prims) instead of merging opinions?', o: ['Relocates', 'Inherits', 'Payloads', 'Variants'], a: 0, why: 'Relocates remap paths.' },
      { t: 'mcq', q: 'A material library wants a base "Plastic" that derived plastics refine, and refinements must never be overridden by base edits. Arc?', o: ['Inherits', 'Specializes', 'Payload', 'Sublayer'], a: 1, why: 'Specializes guarantees derived refinements win.' },
    ]},
  ]
});

// ------------------------------------------------------------ U11
UNITS.push({
  id: 'u11', part: 'p2', title: 'LIVERPS & RESOLUTION', sub: 'Strength order, list ops, debugging', emoji: '🏋️', color: '#ff4b4b', shadow: '#d63a3a',
  items: [
    { id: 'u11l1', kind: 'lesson', title: 'LIVERPS', steps: [
      { t: 'info', h: 'Strength ordering', p: `When opinions arrive through different arcs, USD ranks them, strongest first:<br><br><b class="c1">L</b>ocal: the layer stack itself (root, sublayers, session)<br><b class="c2">I</b>nherits<br><b class="c3">V</b>ariantSets<br><b class="c4">E</b> r<b>E</b>locates<br><b class="c5">R</b>eferences<br><b class="c6">P</b>ayloads<br><b class="c7">S</b>pecializes<br><br>Say it "<b>liver peas</b>". Older docs say LIVRPS, from before relocates existed.` },
      { t: 'widget', w: 'liverps', h: 'Turn arcs on & off', p: 'Each arc has an opinion on the colour. Toggle arcs and see who wins.' },
      { t: 'info', h: 'It\'s recursive', p: `Each arc points at a <b>layer stack</b> that can have its own arcs, which are ranked the same way inside it. USD computes all of this once per prim and caches the result as the prim's <b>index</b>: an ordered list of every contributing site, strongest to weakest.<br><br>Also, <b>direct</b> arcs on a prim beat the same kind of arc coming from its <b>ancestors</b>.` },
      { t: 'order', q: 'Order the arcs, strongest first.', items: ['Local', 'Inherits', 'VariantSets', 'References', 'Payloads', 'Specializes'], why: 'L-I-V-(E)-R-P-S' },
      { t: 'mcq', q: 'A variant sets colour = green. A reference sets colour = red. No local opinion. Result?', o: ['green', 'red', 'neither'], a: 0, why: 'V is stronger than R.' },
      { t: 'mcq', q: 'Inherits says red, reference says blue, payload says green. Result?', o: ['red', 'blue', 'green'], a: 0, why: 'I > R > P' },
      { t: 'info', h: 'Key takeaways', p: `• <b>L I V E R P S</b>: Local, Inherits, Variants, rElocates, References, Payloads, Specializes<br>• Applied recursively, and cached per prim as its <b>index</b>` },
    ]},
    { id: 'u11l2', kind: 'lesson', title: 'List editing', steps: [
      { t: 'info', h: 'Lists across layers', p: `Some things are <b>lists</b>: references, payloads, inherits, specializes, variantSets, apiSchemas, relationship targets. Layers don't replace these lists. They <b>edit</b> them with <b>list ops</b>:<br><br><code>prepend</code>: add to the <b>front</b> (stronger)<br><code>append</code>: add to the <b>back</b> (weaker)<br><code>delete</code>: remove an entry<br>(no keyword): an <b>explicit</b> list that replaces everything weaker` },
      { t: 'info', h: 'Example', lang: 'usda', code: `# seq.usda (weaker)\nover "Shot" ( prepend references = @turbulence.usd@ )\n\n# shot.usda (stronger)\nover "Shot" (\n    delete references = @turbulence.usd@\n    prepend references = @shotEffect1.usd@\n)`, p: 'A shot swaps out a sequence-level effect:', after: 'The composed list contains only shotEffect1.usd. Resolved lists never contain duplicates.' },
      { t: 'mcq', q: 'Which keyword makes your reference the strongest entry in the list?', o: ['append', 'prepend', 'add', 'delete'], a: 1, why: 'prepend puts it at the front.' },
      { t: 'tf', q: 'Attribute values like radius can be list-edited with prepend/append.', a: false, why: 'Attributes resolve strongest-wins. List editing is for lists like arcs, relationships and some metadata.' },
      { t: 'info', h: 'Relationships combine', p: `Because relationship targets are list-edited, a relationship's final targets can combine opinions from <b>several layers</b>, not just the strongest. A weaker layer adds <code>&lt;/L/Key&gt;</code>, a stronger one prepends <code>&lt;/L/Rim&gt;</code>, and the result is both.` },
      { t: 'info', h: 'Key takeaways', p: `• Lists are edited, not replaced: <b>prepend / append / delete / explicit</b><br>• Prefer <code>prepend</code> so your arc is the strongest entry<br>• Relationship targets can combine across layers` },
    ]},
    { id: 'u11l3', kind: 'lesson', title: 'Debugging composition', steps: [
      { t: 'info', h: '"Why is it red?!"', p: `When a value surprises you, ask the stage <b>where it came from</b>:`, lang: 'py', code: `prim = stage.GetPrimAtPath('/World/Car')\nfor spec in prim.GetPrimStack():        # strongest → weakest\n    print(spec.layer.identifier, spec.path)\n\nattr = prim.GetAttribute('primvars:displayColor')\nfor spec in attr.GetPropertyStack(Usd.TimeCode.Default()):\n    print(spec.layer.identifier)\n\nprint(attr.GetResolveInfo().GetSource())  # default / timeSamples / fallback…`, after: 'The <b>PrimStack</b> and <b>PropertyStack</b> list every contributing spec, in strength order.' },
      { t: 'info', h: 'Specs vs composed objects', p: `In a layer, a prim is stored as a <b>PrimSpec</b> (uncomposed: just what that one layer says), and properties as <b>PropertySpecs</b>. The stage's <b>UsdPrim</b> is the composed view over all of them.<br><br>Sdf = the raw specs in layers. Usd = the composed stage.<div class="hou">🟠 <b>Houdini:</b> the <b>Scene Graph Details</b> pane has <b>Layer Stack</b> and <b>Composition</b> tabs showing exactly this for the selected prim.</div>` },
      { t: 'mcq', q: 'Which call lists every spec contributing to a prim, strongest first?', o: ['prim.GetChildren()', 'prim.GetPrimStack()', 'stage.Traverse()', 'prim.GetPath()'], a: 1, why: 'GetPrimStack() returns contributing PrimSpecs in strength order.' },
      { t: 'match', q: 'Match.', pairs: [['PrimSpec', 'One layer\'s uncomposed prim'], ['UsdPrim', 'Composed prim on the stage'], ['Prim index', 'Cached composition result'], ['Sdf', 'Layer-level API']] },
      { t: 'info', h: 'Key takeaways', p: `• <code>GetPrimStack()</code>, <code>GetPropertyStack()</code> and <code>GetResolveInfo()</code> explain a value<br>• <b>Sdf</b> = layer specs, <b>Usd</b> = the composed view` },
    ]},
    { id: 'u11c1', kind: 'challenge', title: 'Composition boss', timed: true, steps: [
      { t: 'mcq', q: 'Local opinion: radius 1. Reference: radius 3. Specializes: radius 5. Result?', o: ['1', '3', '5'], a: 0, why: 'Local is strongest.' },
      { t: 'mcq', q: 'Variant: visible. Inherits: invisible. Result?', o: ['visible', 'invisible'], a: 1, why: 'I beats V.' },
      { t: 'tf', q: 'subLayers create the "L" in LIVERPS: their opinions all count as local.', a: true, why: 'The layer stack is "Local".' },
      { t: 'mcq', q: 'An unselected variant set contributes…', o: ['Its first variant', 'Nothing', 'All variants'], a: 1, why: 'Nothing.' },
      { t: 'mcq', q: 'Which arc rewrites namespace?', o: ['Relocates', 'Inherits', 'Payloads'], a: 0, why: 'Relocates.' },
      { t: 'order', q: 'Strongest → weakest.', items: ['Inherits', 'VariantSets', 'References', 'Specializes'], why: 'I-V-R-S' },
      { t: 'mcq', q: 'To remove a weaker layer\'s reference you use…', o: ['delete references = @x@', 'references = None', 'active = false'], a: 0, why: 'The delete list op.' },
      { t: 'tf', q: 'An over on _class_Tree in the shot affects referenced trees that inherit it.', a: true, why: 'Inherits are live through references.' },
    ]},
  ]
});
