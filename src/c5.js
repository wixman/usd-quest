// ============================================================
//  PART 5: HOUDINI SOLARIS (chapters 1–6)
//  Based on SideFX Houdini 22 docs (notes where things changed).
// ============================================================

// ------------------------------------------------------------ S1
UNITS.push({
  id: 's1', part: 'p5', title: 'SOLARIS BASICS', sub: 'LOPs, the stage context and the UI', emoji: '🟠', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 's1l1', kind: 'lesson', title: 'What Solaris is', steps: [
      { t: 'info', h: 'Solaris = Houdini + USD', p: `<b>Solaris</b> is the name for all of Houdini's USD tooling: scene assembly, layout, look development, lighting and Karma rendering. It lives in the <code>/stage</code> network context, whose nodes are <b>LOPs</b> (Lighting Operators).<br><br>Like SOPs, each LOP takes something in, changes it, and passes it on. But instead of Houdini geometry, a LOP takes in a <b>USD stage</b> and outputs a <b>modified USD stage</b>.` },
      { t: 'info', h: 'Procedural USD', p: `This is the key mental model:<br><br>• Every LOP node <b>outputs a fully composed USD stage</b>.<br>• Houdini builds the USD as a <b>side effect of cooking</b> the network. You never hand-edit the tree.<br>• When a node changes something, it writes <b>opinions</b> into a layer, exactly as you learned in Parts 1–3.<br><br>So everything you know about layers, arcs and LIVERPS applies directly. LOPs just author it for you.` },
      { t: 'mcq', q: 'What does each LOP node output?', o: ['Houdini geometry', 'A composed USD stage', 'A .usd file on disk', 'A render'], a: 1, why: 'Each LOP takes a USD stage in and outputs a modified stage.' },
      { t: 'tf', q: 'LOPs edit the USD scene graph directly, like a text editor.', a: false, why: 'The USD is generated as a side effect of cooking the node network.' },
      { t: 'info', h: 'The viewer = Hydra', p: `The Solaris viewport is a <b>Hydra</b> viewer. From the viewport's renderer menu you can switch the <b>render delegate</b> live:<br><br>• <b>Houdini VK</b>: Houdini's fast real-time delegate<br>• <b>Storm</b>: Pixar's real-time delegate<br>• <b>Karma CPU</b> / <b>Karma XPU</b>: interactive path-traced renders (IPR)<br>• third-party delegates (RenderMan, Arnold, Redshift…) if installed` },
      { t: 'mcq', q: 'You want a path-traced preview right in the Solaris viewport. What do you switch?', o: ['The network type', 'The viewport\'s Hydra render delegate to Karma', 'The display flag', 'Nothing; it needs a ROP'], a: 1, why: 'Solaris\' viewer is Hydra, so pick Karma CPU/XPU as the delegate.' },
      { t: 'info', h: 'Key takeaways', p: `• Solaris = Houdini's USD toolset in <code>/stage</code>. Nodes are <b>LOPs</b><br>• Each LOP outputs a composed stage. USD is a by-product of cooking<br>• The viewport is Hydra, so you can swap delegates (VK, Storm, Karma…)` },
    ]},
    { id: 's1l2', kind: 'lesson', title: 'The Solaris UI', steps: [
      { t: 'info', h: 'Key panes', p: `The <b>Solaris desktop</b> adds USD-specific panes:<br><br>• <b>Scene Graph Tree</b>: the prim hierarchy of the selected LOP's output<br>• <b>Scene Graph Details</b>: attributes and metadata of the selected prim, with <b>Layer Stack</b> and <b>Composition</b> tabs showing which layers contribute and how<br>• <b>Scene Graph Layers</b>: the layer stack of the selected LOP, where you can temporarily mute layers` },
      { t: 'info', h: 'Tree toggles are temporary', p: `The eye (visibility) and active toggles in the Scene Graph Tree are handy, but they write into an <b>unsaved in-memory layer</b>, like USD's session layer. They <b>don't</b> change your final USD output.<br><br>For permanent changes, use nodes: <b>Prune</b>, <b>Configure Primitives</b>, <b>Edit Properties</b>…` },
      { t: 'tf', q: 'Hiding a prim with the eye icon in the Scene Graph Tree hides it in the USD you export.', a: false, why: 'Tree toggles go into an unsaved scratch layer. Use a Prune or Configure Primitives LOP for real changes.' },
      { t: 'info', h: 'Seeing the USD', p: `Right-click a LOP → <b>LOP Actions ▸ Inspect Flattened Stage</b> shows the whole composed stage as .usda text. <b>Inspect Active Layer</b> shows just the layer that node is writing.<br><br>The node's <b>debug flag</b> forces that node's edits into their own separate layer, so you can see exactly what it adds. It doesn't change the composed result but uses more memory, so turn it off when done.` },
      { t: 'mcq', q: 'You want to read the exact .usda a single node contributes. Fastest way?', o: ['Render it', 'Debug flag + Inspect Active Layer', 'Export the whole scene', 'Scene Graph Tree eye icon'], a: 1, why: 'The debug flag isolates the node\'s edits in its own layer, and Inspect shows them.' },
      { t: 'info', h: 'Node outlines', p: `By default the network editor draws node outlines in a <b>different colour when a node starts writing to a new active layer</b>, so you can see at a glance where layers begin.` },
      { t: 'info', h: 'Key takeaways', p: `• Scene Graph Tree / Details (Layer Stack + Composition tabs) / Layers panes<br>• Tree eye/active toggles are temporary, so use nodes for real edits<br>• Inspect Flattened Stage / Active Layer + the debug flag show the raw USD` },
    ]},
    { id: 's1d1', kind: 'drill', title: 'Basics drill', steps: [
      { t: 'mcq', q: 'LOPs stands for…', o: ['Layer Operators', 'Lighting Operators', 'Loop Operators', 'Look Operators'], a: 1, why: 'Lighting Operators.' },
      { t: 'match', q: 'Match the pane.', pairs: [['Scene Graph Tree', 'Prim hierarchy'], ['Scene Graph Details', 'Attributes, layers, composition'], ['Scene Graph Layers', 'Layer stack, mute'], ['Viewport', 'Hydra delegate view']] },
      { t: 'tf', q: 'Switching the viewport to Karma XPU changes your exported USD.', a: false, why: 'The delegate is just how the stage is drawn.' },
      { t: 'mcq', q: 'Which node action shows the composed stage as .usda?', o: ['Inspect Flattened Stage', 'Save to Disk', 'Bypass', 'Lock'], a: 0, why: 'LOP Actions ▸ Inspect Flattened Stage.' },
    ]},
  ]
});

// ------------------------------------------------------------ S2
UNITS.push({
  id: 's2', part: 'p5', title: 'LAYERS IN LOPS', sub: 'Active layer, layer breaks, sublayers', emoji: '🥞', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 's2l1', kind: 'lesson', title: 'The active layer', steps: [
      { t: 'info', h: 'How LOPs store edits', p: `In a LOP network:<br><br>• The stage's <b>root layer is always empty</b> except for a stack of <b>sublayers</b>.<br>• Sublayers are either <b>anonymous in-memory layers</b> created by LOP nodes (e.g. SOP Import), or <b>layers on disk</b> (e.g. from a Sublayer LOP).<br>• LOP nodes <b>never modify on-disk layers</b>. Edits always go into an in-memory layer above.<br>• Edits normally go into the <b>strongest in-memory layer</b>, called the <b>active layer</b>.` },
      { t: 'widget', w: 'lopLayers', h: 'Watch the layers form', p: 'Step through a LOP chain. See which layer each node writes to, then add a Layer Break.' },
      { t: 'info', h: 'Disk layers on top', p: `If the strongest sublayer is a <b>file on disk</b> (say you just sublayered <code>layout.usd</code>), the next editing node automatically creates a <b>new anonymous layer</b> on top for its edits, since it can't touch the file.` },
      { t: 'tf', q: 'A Transform LOP after a Sublayer LOP edits the sublayered file on disk.', a: false, why: 'LOPs never modify disk layers. A new anonymous active layer is created on top.' },
      { t: 'info', h: 'No Edit Targets', p: `Solaris <b>doesn't use USD's EditTarget</b>. To get similar results there are dedicated nodes:<br><br>• <b>Edit Target Layer</b>: applies edits directly to a lower layer<br>• <b>Load Layer for Editing</b><br>• <b>Layer Replace</b>: swaps every use of a layer for a substitute<div class="warn">⚠️ In a Python Script LOP, never change the stage's edit target yourself. Houdini sets it to the active layer.</div>` },
      { t: 'mcq', q: 'Solaris equivalent of USD\'s SetEditTarget(lowerLayer)?', o: ['Layer Break', 'Edit Target Layer LOP', 'Merge LOP', 'Null LOP'], a: 1, why: 'Edit Target Layer applies edits directly to a lower layer.' },
      { t: 'info', h: 'Key takeaways', p: `• Root layer = empty + sublayers. LOPs write into the <b>active</b> (strongest in-memory) layer<br>• Disk layers are never modified. A new anonymous layer appears above them<br>• No EditTarget. Use Edit Target Layer / Load Layer for Editing / Layer Replace` },
    ]},
    { id: 's2l2', kind: 'lesson', title: 'Stack-shaping nodes', steps: [
      { t: 'info', h: 'Sublayer & Merge', p: `<b>Sublayer LOP</b>: imports USD files as sublayers, or removes, replaces and reorders existing ones. Sublayering is how you bring in whole scenes such as a layout file or a department layer.<br><br><b>Merge LOP</b>: combines the layers from several input branches into <b>one layer stack</b>. Earlier inputs are weaker, and later inputs are stronger.` },
      { t: 'info', h: 'Layer Break', p: `A <b>Layer Break</b> LOP starts a <b>new active layer</b> for the nodes after it, and marks everything before it as "authored before the break".<br><br>• The <b>viewer still shows</b> everything (composition is unchanged)<br>• But when USD is <b>written to disk</b>, all layers <b>before the break are discarded</b><br><br>This lets you load <b>context</b> (the set, the characters) to work against, while only <b>saving your own edits</b>.` },
      { t: 'mcq', q: 'You load the whole set to light against, but only want your lighting overrides saved. What goes between them?', o: ['Merge', 'Layer Break', 'Null', 'Cache'], a: 1, why: 'Layers before a Layer Break aren\'t written out.' },
      { t: 'info', h: 'Sparse overrides', p: `Combine a Layer Break with a <b>Prune</b>: deactivate a prim that came from upstream, and the written layer contains <b>only</b> the override (<code>over "Tree" (active = false)</code>). When that file is later layered over the set, the prim path matches and the tree disappears.` },
      { t: 'info', h: 'Configure Layer & Stage Manager', p: `<b>Configure Layer</b>: edits layer metadata, such as the <b>save path</b> (where this layer will be written), <b>defaultPrim</b>, up axis and time codes. It can also start a new layer.<br><br><b>Stage Manager</b>: imports many files at once as references and places them in the tree, flattening into a single new active layer.` },
      { t: 'match', q: 'Match the LOP.', pairs: [['Sublayer', 'Add/reorder sublayer files'], ['Merge', 'Combine input branches\' layers'], ['Layer Break', 'New layer; earlier ones not saved'], ['Configure Layer', 'Save path, default prim']] },
      { t: 'info', h: 'Key takeaways', p: `• <b>Sublayer</b> adds files, and <b>Merge</b> combines branches into one stack<br>• <b>Layer Break</b> = save only what comes after (context above, edits below)<br>• <b>Configure Layer</b> sets save path and defaultPrim` },
    ]},
    { id: 's2d1', kind: 'drill', title: 'LOP layer drill', steps: [
      { t: 'tf', q: 'In a LOP network the root layer contains your prims directly.', a: false, why: 'The root layer is empty except for sublayers.' },
      { t: 'mcq', q: 'The "active layer" is…', o: ['The weakest disk layer', 'The strongest in-memory layer that nodes write into', 'The session layer', 'The root layer'], a: 1, why: 'Edits go into the strongest in-memory layer.' },
      { t: 'mcq', q: 'Which node marks earlier layers as "don\'t save"?', o: ['Configure Layer', 'Layer Break', 'Sublayer', 'Merge'], a: 1, why: 'Layer Break.' },
      { t: 'tf', q: 'A Layer Break changes what you see in the viewport.', a: false, why: 'Composition is unchanged. It only affects what\'s written.' },
      { t: 'mcq', q: 'Assign a file path where a layer will be written:', o: ['Configure Layer (save path)', 'Layer Replace', 'Edit Target Layer', 'Graft Stages'], a: 0, why: 'Configure Layer sets the save path metadata.' },
    ]},
  ]
});

// ------------------------------------------------------------ S3
UNITS.push({
  id: 's3', part: 'p5', title: 'GEOMETRY IN', sub: 'SOP Import, SOP Create & friends', emoji: '📥', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 's3l1', kind: 'lesson', title: 'Importing SOPs', steps: [
      { t: 'info', h: 'The nodes', p: `• <b>SOP Import</b>: brings SOP geometry from elsewhere into the stage, with lots of conversion settings<br>• <b>SOP Create</b>: build geometry in a SOP network <b>inside</b> the LOP node<br>• <b>SOP Modify</b>: runs a SOP network on existing USD geometry and converts the changes back into USD overrides<br>• <b>Scene Import</b>: imports /obj-level models, materials, lights and cameras<br>• <b>USD Configure SOP</b>: stores import settings as <code>usdconfig…</code> detail attributes on the geometry itself` },
      { t: 'info', h: 'Where do prims go?', p: `SOP geometry has no hierarchy of its own. Without help, all polygons land in one prim called <code>mesh_0</code>.<br><br>The <b>Path Attributes</b> parameter (default: the <code>path</code> and <code>name</code> primitive attributes) tells Houdini where each primitive goes. The <b>Import Path Prefix</b> is prepended to relative paths:<br><br>prefix <code>/world/geo</code>:<br>• <code>mesh_0</code> → <code>/world/geo/mesh_0</code><br>• <code>chair/leg</code> → <code>/world/geo/chair/leg</code><br>• <code>/moon/crater</code> → <code>/moon/crater</code> (absolute, unchanged)` },
      { t: 'mcq', q: 'Prefix is /world/geo. A primitive\'s path attribute is "table/top". Resulting prim?', o: ['/table/top', '/world/geo/table/top', '/world/geo/mesh_0', '/world/table/top'], a: 1, why: 'Relative paths get the prefix.' },
      { t: 'tf', q: 'With no path attribute, each polygon becomes its own prim.', a: false, why: 'All polygons go into a single mesh_0 prim.' },
      { t: 'info', h: 'Attribute mapping', p: `<code>P</code> → <code>points</code> · <code>N</code> → <code>normals</code> · <code>v</code> → <code>velocities</code> · <code>accel</code> → <code>accelerations</code><br><code>Cd</code> → <code>primvars:displayColor</code> · <code>Alpha</code> → <code>primvars:displayOpacity</code><br><code>uv</code> → <code>primvars:st</code> · <code>pscale</code>/<code>width</code> → <code>widths</code> · <code>id</code> → <code>ids</code><br>Other attributes become primvars with the matching interpolation (detail → constant, prim → uniform, point → vertex, vertex → faceVarying).` },
      { t: 'match', q: 'Match SOP → USD.', pairs: [['P', 'points'], ['Cd', 'primvars:displayColor'], ['uv', 'primvars:st'], ['v', 'velocities']] },
      { t: 'info', h: 'Key takeaways', p: `• SOP Import / SOP Create / SOP Modify / Scene Import<br>• <code>path</code>/<code>name</code> attributes + Import Path Prefix decide the hierarchy<br>• Standard attributes map to USD names, and the rest become primvars` },
    ]},
    { id: 's3l2', kind: 'lesson', title: 'Control attributes', steps: [
      { t: 'info', h: 'usd* attributes', p: `Special primitive attributes let your SOP network control the USD:<br><br><code>usdkind</code>: set the prim's kind<br><code>usdpurpose</code>: default / render / proxy / guide<br><code>usdvisibility</code>: invisible / inherit<br><code>usdactive</code>: 0 or 1<br><code>usdmaterialpath</code>: bind a material<br><code>usdinherits</code> / <code>usdspecializes</code>: add arcs<br><code>usdprimtype</code> on points: create prims of that type, e.g. Xforms or lights<br><code>usdapischemas</code>: apply API schemas<br><code>osd_scheme</code>: subdivision scheme per face` },
      { t: 'mcq', q: 'Which SOP attribute assigns a material during import?', o: ['shop_materialpath', 'usdmaterialpath', 'material', 'Cd'], a: 1, why: 'usdmaterialpath authors material bindings for SOP Import / SOP Create.' },
      { t: 'info', h: 'Subsets & instancing', p: `• <b>Subset Groups</b>: SOP primitive groups become <b>GeomSubsets</b>, ready for per-face materials.<br>• <b>Packed primitives</b> can import as <b>point instancers</b> or <b>native instances</b>. <code>usdinstancerpath</code> sets where the instancer goes, and <code>usdprototypespath</code> where prototypes go.` },
      { t: 'info', h: 'Time & topology', p: `By default SOP Import <b>time-samples</b> attributes, and Hydra does extra work for time-sampled values even if there's only one sample.<br><br>For static geometry: list attributes in <b>Set Default Values</b> (stored as defaults, not samples) and set <b>Topology Attributes</b> to <b>Static</b>. In big scenes this matters a lot.<div class="tip">💡 USD expects right-handed winding and Houdini is left-handed, so SOP Import reverses vertex order for you.</div>` },
      { t: 'tf', q: 'Even a single time sample costs Hydra more than a default value.', a: true, why: 'Hydra treats time-sampled data as potentially animated.' },
      { t: 'match', q: 'Match.', pairs: [['usdkind', 'Prim kind'], ['usdpurpose', 'Render/proxy/guide'], ['Subset Groups', 'GeomSubsets'], ['usdinstancerpath', 'Point instancer path']] },
      { t: 'info', h: 'Key takeaways', p: `• <code>usd*</code> attributes control kind, purpose, visibility, materials, arcs and prim types<br>• Groups become GeomSubsets, and packed prims become instancers or native instances<br>• Use static topology + Set Default Values for non-animated data` },
    ]},
    { id: 's3d1', kind: 'drill', title: 'Import drill', steps: [
      { t: 'mcq', q: 'Build geometry with SOPs inside a LOP node, no external SOP network:', o: ['SOP Import', 'SOP Create', 'Scene Import', 'Reference'], a: 1, why: 'SOP Create contains its own SOP subnet.' },
      { t: 'mcq', q: 'Edit existing USD geometry with SOPs and write back overrides:', o: ['SOP Modify', 'SOP Import', 'Merge', 'Graft'], a: 0, why: 'SOP Modify.' },
      { t: 'fill', q: 'Make imported prims render-only.', lang: 'py', code: `// primitive wrangle before import\ns@▢ = "▢";`, blanks: ['usdpurpose', 'render'], extra: ['usdkind', 'proxy', 'purpose'], why: 'usdpurpose = "render".' },
      { t: 'tf', q: 'SOP Import can import packed primitives as a PointInstancer.', a: true, why: 'Packed prims → point instancers or native instances.' },
    ]},
  ]
});

// ------------------------------------------------------------ S4
UNITS.push({
  id: 's4', part: 'p5', title: 'PRIM PATTERNS', sub: 'Selecting prims like a pro', emoji: '🎯', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 's4l1', kind: 'lesson', title: 'Path patterns', steps: [
      { t: 'info', h: 'Why patterns', p: `Almost every LOP has a <b>Primitives</b> parameter saying which prims to affect. You can type paths, but the real power is the <b>pattern syntax</b>:<br><br><code>*</code>: any characters <b>within one name</b><br><code>**</code>: any number of <b>levels</b><br><code>?</code>: exactly one character<br><code>[abc]</code>: one of these characters<br><br><code>/Kitchen/*</code>: children of Kitchen<br><code>/Kitchen/Chair*</code>: Chair1, ChairBig…<br><code>/Kitchen/**/Handle[1234]</code>: Handle1–4 at any depth` },
      { t: 'widget', w: 'patternTester', h: 'Pattern tester', p: 'Tap a pattern (or type your own) and see which prims match.' },
      { t: 'mcq', q: 'Which matches every prim at any depth under /World/Props?', o: ['/World/Props/*', '/World/Props/**', '/World/Props?', '/World/Props/[*]'], a: 1, why: '** spans any number of levels. * only matches one level.' },
      { t: 'info', h: 'Set operators', p: `Combine patterns:<br>• <b>Union</b>: a space or <code>+</code>: <code>/a/* /b/*</code><br>• <b>Intersection</b>: <code>&amp;</code><br>• <b>Subtraction</b>: <code>-</code> or <code>^</code>: <code>/Kitchen/* - /Kitchen/Fridge</code><br>• <b>Grouping</b>: <code>( )</code><div class="warn">⚠️ All operators share <b>one precedence level</b>, left to right. <code>/* - /a /b</code> means <code>(/* - /a) + /b</code>, which adds /b back! Write <code>/* - (/a /b)</code>.</div>` },
      { t: 'mcq', q: 'You want everything under /set except /set/a and /set/b. Which is right?', o: ['/set/* - /set/a /set/b', '/set/* - (/set/a /set/b)', '/set/* & /set/a /set/b', '/set/** ^ /set/a'], a: 1, why: 'Without parentheses, /set/b gets unioned back in.' },
      { t: 'info', h: 'Key takeaways', p: `• <code>*</code> one level, <code>**</code> any depth, <code>?</code> and <code>[]</code> single chars<br>• space/<code>+</code> union, <code>&amp;</code> intersect, <code>-</code>/<code>^</code> subtract<br>• One precedence level, left to right, so use parentheses` },
    ]},
    { id: 's4l2', kind: 'lesson', title: 'Auto collections', steps: [
      { t: 'info', h: '% queries', p: `<b>Auto collections</b> start with <code>%</code> and select prims by what they <i>are</i>, not where they are:<br><br><code>%type:Mesh</code>: by schema type (subtypes too, so <code>%type:Light</code> matches every kind of light)<br><code>%kind:component</code>: by kind (subkinds too)<br><code>%purpose:proxy</code>: by purpose<br><code>%variant(lod=high)</code>: by variant selection<br><code>%instance</code> / <code>%instanceproxy</code><br><code>%payload(loaded=no)</code><br><code>%shadertype(UsdPreviewSurface)</code><br><code>%rendercamera</code>, <code>%rendersettings</code>` },
      { t: 'info', h: 'Hierarchy & space', p: `<code>%descendants(pat)</code>, <code>%children(pat)</code>, <code>%ancestors(pat)</code>, <code>%parents(pat)</code><br>Shortcuts written <b>after</b> a pattern: <code>pat &gt;&gt;</code> adds descendants, <code>pat &lt;&lt;</code> adds ancestors, <code>pat &lt;&lt;&gt;&gt;</code> both<br><br><code>%bound(/cam)</code>: prims inside the camera frustum<br><code>%closerthan(/cam, 50)</code> · <code>%fartherthan(/cam, 500)</code><br><code>%size(minvolume=…)</code><br><code>%keeprandom(pat, fraction=0.3)</code>: a stable random subset<br><code>%geofrommat(/Mats/Red)</code>: geometry bound to a material` },
      { t: 'mcq', q: 'Select every light in the scene:', o: ['/**/Light*', '%type:Light', '%kind:light', '/lights/*'], a: 1, why: '%type matches by schema (and subtypes), wherever the prims live.' },
      { t: 'mcq', q: 'Select only prims visible to /cams/shot1:', o: ['%bound(/cams/shot1)', '%visible', '%rendercamera', '%closerthan(/cams/shot1)'], a: 0, why: '%bound with a camera tests the frustum.' },
      { t: 'info', h: 'Collections & VEX', p: `• Reference a USD collection: <code>/World.collection:hero</code>, or <code>%/World/hero</code>, or <code>%hero</code> for collections stored on <code>/collections</code>. The <b>Collection LOP</b> builds collections from patterns.<br>• Escape to VEX with <code>{ … }</code>: <code>/world/** &amp; { @radius &gt; 2 }</code>. This is slow, so narrow it with <code>&amp;</code> first.<br>• <code>~</code> <b>prunes</b> traversal: <code>%type:Xform ~ %kind:component</code> finds Xforms but stops descending whenever it hits a component. That's much faster than subtracting descendants.` },
      { t: 'tf', q: 'VEX expressions in patterns are cheap, so use them freely on huge scenes.', a: false, why: 'They\'re expensive. Narrow the search with & and built-in tests first.' },
      { t: 'info', h: 'Key takeaways', p: `• <code>%type</code>, <code>%kind</code>, <code>%purpose</code>, <code>%variant</code>, <code>%bound</code>… select by meaning<br>• <code>&gt;&gt;</code>/<code>&lt;&lt;</code> for descendants/ancestors, <code>~</code> to prune<br>• <code>%name</code> for collections, <code>{ VEX }</code> as a last resort` },
    ]},
    { id: 's4d1', kind: 'drill', title: 'Pattern drill', steps: [
      { t: 'mcq', q: '/Kitchen/Chair? matches…', o: ['Chair1 and ChairA', 'Chair12', 'Chair', 'Every chair at any depth'], a: 0, why: '? = exactly one character.' },
      { t: 'match', q: 'Match the operator.', pairs: [['space or +', 'Union'], ['&', 'Intersection'], ['- or ^', 'Subtraction'], ['~', 'Prune traversal']] },
      { t: 'mcq', q: 'What does <code>%type:Xform ~ %kind:component</code> find?', o: ['Xforms that are also components', 'Xforms outside components, without descending into components', 'All components', 'Xforms minus everything'], a: 1, why: '~ prunes: traversal stops when a component is found, so it\'s a fast way to find Xforms outside components.' },
      { t: 'mcq', q: 'Pick 30% of /forest/* at random, the same each cook:', o: ['%keeprandom(/forest/*, fraction=0.3)', '/forest/*?0.3', '%random(30)', '{ rand(@elemnum) < 0.3 }'], a: 0, why: '%keeprandom gives a stable random subset.' },
    ]},
  ]
});

// ------------------------------------------------------------ S5
UNITS.push({
  id: 's5', part: 'p5', title: 'BUILDING ASSETS', sub: 'Component Builder & variants', emoji: '📦', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 's5l1', kind: 'lesson', title: 'Component Builder', steps: [
      { t: 'info', h: 'The four nodes', p: `The <b>Component Builder</b> tool drops a network that builds a pipeline-ready USD asset:<br><br>1️⃣ <b>Component Geometry</b>: a SOP network with three outputs: <b>default</b> (final geo), <b>proxy</b> (viewport), <b>simproxy</b> (collision)<br>2️⃣ <b>Material Library</b>: a VOP network of materials<br>3️⃣ <b>Component Material</b>: assigns materials to geometry (and its subsets)<br>4️⃣ <b>Component Output</b>: assembles the asset, writes files, makes thumbnails, registers it in the catalog` },
      { t: 'info', h: 'What it creates', p: `Inside the stage:<br><code>/chair</code>: an Xform with <b>kind = component</b>, payloaded<br>&nbsp;&nbsp;<code>/chair/geo</code>: a Scope. With proxy outputs it gets <code>/proxy</code> (purpose proxy) and <code>/render</code> (purpose render)<br>&nbsp;&nbsp;<code>/chair/mtl</code>: a Scope of materials<br>plus <code>/__class__/chair</code>, a <b>class</b> the root inherits, ready for shot-level broadcast overrides.` },
      { t: 'mcq', q: 'Which Component Geometry output becomes purpose = proxy?', o: ['default', 'proxy', 'simproxy', 'render'], a: 1, why: 'The yellow proxy output is the viewport stand-in.' },
      { t: 'info', h: 'Files written', p: `On <b>Save to Disk</b> (nothing is written before that), under <code>usd/assets/&lt;name&gt;/</code> by default:<br><br><code>chair.usd</code>: the interface, pointing at the payload<br><code>payload.usdc</code>: <b>references</b> (not sublayers) the parts, so variant opinions override correctly<br><code>geo.usdc</code> · <code>mtl.usdc</code> · <code>extra.usdc</code> (only if you add extra LOPs inside Component Output)<br>a thumbnail, and a <code>variants/</code> folder if you use variants` },
      { t: 'tf', q: 'Component Builder writes files continuously as you edit.', a: false, why: 'Nothing is written until you click Save to Disk (or Save to Disk in Background).' },
      { t: 'info', h: 'Naming', p: `Component Output's <b>Root Prim</b> defaults to <code>/$OS</code> (the node's name), so rename it to something meaningful. The file name defaults to that name plus <code>.usd</code>, and the <b>Location</b> parameter sets the output folder.` },
      { t: 'info', h: 'Key takeaways', p: `• Geometry → Material Library → Component Material → Component Output<br>• default / proxy / simproxy outputs, root kind = component, class prim, payload<br>• Files: interface .usd + payload + geo/mtl/extra + thumbnail, written on Save to Disk` },
    ]},
    { id: 's5l2', kind: 'lesson', title: 'Variants & catalog', steps: [
      { t: 'info', h: 'Geometry variants', p: `Make one <b>Component Geometry</b> node per variant and wire them into <b>Component Geometry Variants</b>. Variant names default to the node names, and the set is called <code>geo</code> by default.<br><br>(Multiple or nested <i>geometry</i> variant sets aren't supported here.)` },
      { t: 'info', h: 'Material variants', p: `Add extra <b>Component Material</b> nodes, each with a <b>Variant Name</b>, to create a material variant set (<code>mtl</code> by default). You can have several material variant sets. Choose the default selections on Component Output (<b>Set Default Variants</b>).` },
      { t: 'match', q: 'Match the default variant set name.', pairs: [['geo', 'Geometry variants'], ['mtl', 'Material variants']] },
      { t: 'info', h: 'Thumbnails & catalog', p: `Component Output can make a thumbnail from the viewport, Houdini GL (fastest), a <b>Karma render</b> (best quality) or an existing image file.<br><br><b>Add to Asset Catalog</b> registers the written asset in the USD <b>asset catalog</b> database, which feeds the <b>Paint Instances</b> node for layout. Save to a shared location if others will use it.<br><br>To edit an existing component later: right-click it in the Scene Graph Tree → <b>Edit Asset Definition from Source Recipe</b>.` },
      { t: 'info', h: 'LOD & variant tools', p: `• <b>Create LOD</b>: generates LOD levels with PolyReduce and stores them as variants<br>• <b>Auto Select LOD</b>: picks a LOD variant by camera distance<br>• <b>Add Variant</b> / <b>Set Variant</b> / <b>Explore Variants</b>: author, select and visualise variants on any prim<br>• <b>Asset Reference</b>: reference + transform + choose variants in one node` },
      { t: 'mcq', q: 'Pick LOD variants automatically based on distance to camera:', o: ['Create LOD', 'Auto Select LOD', 'Set Variant', 'Draw Mode'], a: 1, why: 'Auto Select LOD.' },
      { t: 'info', h: 'Key takeaways', p: `• Geometry variants via Component Geometry Variants (<code>geo</code>). Material variants via extra Component Material nodes (<code>mtl</code>)<br>• The Asset Catalog feeds layout tools<br>• Create LOD / Auto Select LOD / Explore Variants / Asset Reference` },
    ]},
    { id: 's5d1', kind: 'drill', title: 'Asset drill', steps: [
      { t: 'order', q: 'Component Builder nodes, top to bottom.', items: ['Component Geometry', 'Material Library', 'Component Material', 'Component Output'], why: 'geometry → materials → assign → output' },
      { t: 'match', q: 'Match the file.', pairs: [['chair.usd', 'Interface'], ['payload.usdc', 'References geo + mtl'], ['geo.usdc', 'Geometry'], ['extra.usdc', 'Extra LOP edits']] },
      { t: 'mcq', q: 'What kind does the Component Builder root get?', o: ['assembly', 'group', 'component', 'subcomponent'], a: 2, why: 'component.' },
      { t: 'tf', q: 'payload.usdc sublayers geo and mtl.', a: false, why: 'It references them, so opinions override correctly with variants.' },
      { t: 'mcq', q: 'Collision geometry goes into which output?', o: ['default', 'proxy', 'simproxy'], a: 2, why: 'simproxy.' },
    ]},
  ]
});

// ------------------------------------------------------------ S6
UNITS.push({
  id: 's6', part: 'p5', title: 'LAYOUT & INSTANCING', sub: 'References, Paint Instances, Edit', emoji: '🏙️', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 's6l1', kind: 'lesson', title: 'Bringing assets in', steps: [
      { t: 'info', h: 'Reference LOP', p: `The <b>Reference LOP</b> references files (or other LOP branches) onto a prim. Key parameters: the <b>Primitive Path</b> (where it lands), the <b>Reference File</b>, an optional <b>Reference Primitive</b> (otherwise the defaultPrim), and whether to reference or <b>payload</b>.<br><br>Remember the USD rule: referencing is the only way to load the <b>same file at many locations</b>.` },
      { t: 'info', h: 'Faster options', p: `• <b>Asset Reference</b>: reference + transform + set variants in one node<br>• <b>Stage Manager</b>: reference many files at once and arrange them in a tree view<br>• <b>Graft Stages</b> / <b>Graft Branches</b>: attach branches from other inputs into the tree<br>• <b>Duplicate</b>: copy a prim and its children` },
      { t: 'info', h: 'Payloads in Houdini', p: `Houdini <b>loads all payloads by default</b>, so they behave like references: you see them, patterns match them, and LOPs can edit them.<br><br>• Viewer <b>load masks</b> only affect what's <b>displayed</b><br>• <b>Configure Stage</b> can stop specific payloads from loading at all<br>• Unloaded payloads show a <b>red dot</b> in the tree, don't match patterns, and aren't affected by LOPs` },
      { t: 'tf', q: 'Changing the viewer load mask stops LOP nodes from editing those payloads.', a: false, why: 'Load masks only change display. Configure Stage controls actual loading.' },
      { t: 'mcq', q: 'Reference + move + pick a variant, all in one node:', o: ['Reference', 'Asset Reference', 'Graft Stages', 'Stage Manager'], a: 1, why: 'Asset Reference combines Reference, Xform and Set Variant.' },
      { t: 'info', h: 'Key takeaways', p: `• Reference LOP (file + optional prim, reference or payload), Asset Reference, Stage Manager<br>• Houdini loads payloads by default. Configure Stage controls loading, load masks only control display` },
    ]},
    { id: 's6l2', kind: 'lesson', title: 'Placing & scattering', steps: [
      { t: 'info', h: 'Paint Instances (was Layout)', p: `<div class="hou">🆕 In Houdini 22 the <b>Layout LOP</b> was renamed <b>Paint Instances</b>.</div><br>It's a viewer state for <b>placing, scattering and painting</b> USD assets as point instances:<br><br>• Add assets from the <b>Asset Catalog</b> to its prototype gallery<br>• Pick a <b>brush</b> (place, paint, scatter…). Brushes are SOP-network HDAs, and you can make your own<br>• Switch to <b>edit mode</b> to move, rotate and resize instances with handles and physics (the same tools as the Edit LOP)` },
      { t: 'info', h: 'Edit & physics', p: `The <b>Edit LOP</b> lets you transform prims interactively in the viewer, with optional <b>physics</b>: drop objects so they settle and collide naturally. The <b>Drop LOP</b> simulates dropping prims under gravity.<br><br>The <b>Transform LOP</b> is the procedural, parameter-driven alternative.` },
      { t: 'mcq', q: 'In Houdini 22, which node replaced the Layout LOP?', o: ['Stage Manager', 'Paint Instances', 'Scatter Instances', 'Edit'], a: 1, why: 'Layout was renamed Paint Instances.' },
      { t: 'info', h: 'Instancing nodes', p: `• <b>Copy to Points</b>: instance or copy prims onto points (native instances, point instancers or real copies)<br>• <b>PointInstancer</b>: create or edit a PointInstancer from SOP points<br>• <b>Scatter Instances</b> (new in 22): a Hydra generative procedural for scattering<br>• <b>Assign Prototypes</b>: swap which prototype instances use<br>• <b>Modify Point Instances</b>: edit individual instances<br>• <b>Extract Instances</b>: turn an instance into an editable prim ("hero" it)<br>• <b>Prune</b>: hide or deactivate prims <i>and individual point instances</i>` },
      { t: 'match', q: 'Match the job to the node.', pairs: [['Hero one instance', 'Extract Instances'], ['Swap the tree model used', 'Assign Prototypes'], ['Remove some instances', 'Prune'], ['Scatter onto points', 'Copy to Points']] },
      { t: 'info', h: 'Houdini USD tips', p: `• Instance a parent <b>Xform</b>, not the gprim itself<br>• Houdini supports <b>nested</b> point instancing<br>• Store file paths relative to <code>$HIP</code> or <code>$JOB</code>, and use forward slashes even on Windows` },
      { t: 'info', h: 'Key takeaways', p: `• Paint Instances (formerly Layout) + Asset Catalog for interactive dressing<br>• Edit/Drop for physics placement, Transform for procedural moves<br>• Copy to Points / PointInstancer / Scatter Instances / Assign Prototypes / Extract Instances / Prune` },
    ]},
    { id: 's6d1', kind: 'drill', title: 'Layout drill', steps: [
      { t: 'mcq', q: 'Interactive drop-and-settle placement with collisions:', o: ['Transform LOP', 'Edit LOP (physics)', 'Merge LOP', 'Graft Stages'], a: 1, why: 'Edit LOP has physics.' },
      { t: 'tf', q: 'Unloaded payloads still match prim patterns.', a: false, why: 'They don\'t match patterns and aren\'t affected by LOPs.' },
      { t: 'mcq', q: 'Make one instanced tree fully editable:', o: ['Extract Instances', 'Assign Prototypes', 'Layer Break', 'Draw Mode'], a: 0, why: 'Extract Instances.' },
      { t: 'mcq', q: 'Where do Paint Instances get their assets?', o: ['The Asset Catalog', 'The Scene Graph Layers pane', 'MPlay', 'The shelf'], a: 0, why: 'Assets are added from the Asset Catalog.' },
    ]},
  ]
});
