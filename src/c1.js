// ============================================================
//  CURRICULUM — PART 1: FOUNDATIONS
//  Step / question types:
//   info   {h, p(html), code?, lang?, after?(html after code)}
//   widget {w, h, p}
//   mcq    {q, code?, o:[], a, why}
//   tf     {q, a:bool, why}
//   tap    {q, code (tappables in ⟦ ⟧), a:index, why}
//   order  {q, items:[correct order], why}
//   match  {q, pairs:[[l,r]]}
//   fill   {q, code (blanks = ▢), blanks:[], extra:[], why}
//  Rule: every question is answerable from cards that come BEFORE it.
// ============================================================
const PARTS = {
  p1: { title: 'PART 1 · FOUNDATIONS', sub: 'What USD is and how a scene is described', color: '#58cc02' },
  p2: { title: 'PART 2 · COMPOSITION', sub: 'Layers, arcs and how opinions combine', color: '#ff4b4b' },
  p3: { title: 'PART 3 · SCENE DOMAINS', sub: 'Geometry, primvars, models, instancing, shading, lights, render', color: '#1cb0f6' },
  p4: { title: 'PART 4 · CODE & TOOLS', sub: 'The Python API and the command-line toolbox', color: '#ff9600' },
  p5: { title: 'PART 5 · HOUDINI SOLARIS', sub: 'USD the Houdini way: LOPs, Karma and the pipeline', color: '#7c6cff' },
};

const UNITS = [];

// ------------------------------------------------------------ U1
UNITS.push({
  id: 'u1', part: 'p1', title: 'WHAT IS USD?', sub: 'The problem it solves and the big idea', emoji: '🌱', color: '#58cc02', shadow: '#46a302',
  items: [
    { id: 'u1l1', kind: 'lesson', title: 'Why USD exists', steps: [
      { t: 'info', h: 'The problem', p: `Making an animated film or a game means hundreds of artists working on the <b>same scene</b> at once: modellers, layout, animators, FX, lighters. Each of them uses different tools (Houdini, Maya, Blender…).<br><br>The traditional approach is "export a file, hand it on". Somebody always overwrites somebody else, and the files get huge.` },
      { t: 'info', h: 'Pixar\'s answer', p: `<b>Universal Scene Description</b> (USD, now <b>OpenUSD</b>) is Pixar's open-source answer. It's two things at once:<br><br>1️⃣ A <b>way of describing 3D scenes</b>: geometry, transforms, materials, lights, cameras, animation.<br>2️⃣ A <b>C++/Python library</b> that reads many of those descriptions and <b>composes</b> them into one scene, very fast.<br><br>You can think of it as "Git + Photoshop layers" for 3D scenes.` },
      { t: 'info', h: 'The big idea: opinions in layers', p: `Nobody edits the original asset. Each person writes their changes into their <b>own file</b>, called a <b>layer</b>. Every value they write is called an <b>opinion</b>.<br><br>USD stacks the layers and works out the final answer: when two layers disagree, the <b>stronger opinion wins</b>.<br><br>So lighting can make the car red <b>without touching</b> the modeller's file. If lighting deletes its layer, the car goes back to its original colour. That's what <b>non-destructive</b> means.` },
      { t: 'mcq', q: 'In USD, what is an <b>opinion</b>?', o: ['A comment in a file', 'Any value authored in a layer', 'A user\'s rating of an asset', 'A render setting'], a: 1, why: 'Every authored value (attribute value, metadata, relationship target) is an opinion. Composition decides which opinion wins.' },
      { t: 'tf', q: 'To change the colour of a car, a lighter must edit the modeller\'s file.', a: false, why: 'They write an opinion into their own, stronger layer. The modeller\'s file is never touched.' },
      { t: 'info', h: 'Who uses it', p: `USD started at Pixar, was open-sourced in 2016, and is now an industry standard governed by the <b>Alliance for OpenUSD (AOUSD)</b>. Houdini (Solaris), Maya, Blender, Unreal, Omniverse and Apple's AR tools all read and write it.<br><br><div class="hou">🟠 <b>Houdini:</b> Houdini's whole USD toolset is called <b>Solaris</b>, and it lives in the <code>/stage</code> network. You'll get a huge chapter on it at the end of this course.</div>` },
      { t: 'info', h: 'Key takeaways', p: `• USD = a scene description <b>and</b> a library that composes scenes<br>• Work lives in <b>layers</b>, and each value is an <b>opinion</b><br>• Stronger opinions win, so originals stay untouched (<b>non-destructive</b>)` },
    ]},
    { id: 'u1l2', kind: 'lesson', title: 'Files & formats', steps: [
      { t: 'info', h: 'Three flavours of file', p: `<div class="pills"><span class="pill g">.usda</span> <b>ASCII text</b>. Human-readable, great for learning and debugging.<br><span class="pill b">.usdc</span> <b>"Crate" binary</b>. Compact and fast, the default for big data.<br><span class="pill p">.usdz</span> an <b>uncompressed zip package</b> of USD files plus textures, used for delivery and AR.</div><br><span class="pill y">.usd</span> can hold <b>either</b> text or crate. The library sniffs the contents, so you can switch formats without renaming files or breaking references.` },
      { t: 'info', h: 'Why crate is fast', p: `When you open a <code>.usdc</code> file, USD reads a small <b>index</b> first and only loads the data you actually ask for (it can memory-map the file). Values are <b>deduplicated</b>, so repeated arrays are stored once.<br><br>Text and crate are <b>losslessly convertible</b>: you can turn a .usdc into .usda, read it, and turn it back.<div class="tip">💡 Editing a crate file in place <i>appends</i> data, so it can grow. Running it through <code>usdcat</code> rewrites it compactly.</div>` },
      { t: 'match', q: 'Match the extension to what it is.', pairs: [['.usda', 'Text'], ['.usdc', 'Binary crate'], ['.usdz', 'Zip package'], ['.usd', 'Either text or crate']] },
      { t: 'mcq', q: 'You want to open a file in a text editor and read it. Which extension?', o: ['.usdc', '.usda', '.usdz', '.abc'], a: 1, why: '.usda is guaranteed text. .usdc is binary and .usdz is a zip.' },
      { t: 'tf', q: 'A file ending in .usd is always binary.', a: false, why: '.usd can be either text or crate. Only .usda and .usdc force a format.' },
      { t: 'info', h: 'Not just USD files', p: `USD reads other formats through <b>file format plugins</b>. Alembic (<code>.abc</code>), MaterialX (<code>.mtlx</code>), OBJ and others can be opened as if they were USD layers.<br><br><div class="hou">🟠 <b>Houdini:</b> sublayering or referencing an <code>.abc</code> in LOPs uses USD's Alembic plugin, not Houdini's own Alembic code.</div>` },
      { t: 'info', h: 'Key takeaways', p: `• <b>.usda</b> = text, <b>.usdc</b> = binary crate, <b>.usdz</b> = package, <b>.usd</b> = either<br>• Crate is lazy-loaded, deduplicated and losslessly convertible to text<br>• Plugins let USD read Alembic, MaterialX and more` },
    ]},
    { id: 'u1l3', kind: 'lesson', title: 'Your first look', steps: [
      { t: 'info', h: 'A tiny scene', lang: 'usda', code: `#usda 1.0\n(\n    defaultPrim = "World"\n    upAxis = "Y"\n    metersPerUnit = 0.01\n)\n\ndef Xform "World"\n{\n    def Sphere "Ball"\n    {\n        double radius = 2\n    }\n}`, p: 'This is a complete, valid USD file. It describes a sphere called Ball inside a group called World.', after: 'Don\'t worry about every symbol yet. The next units take it apart piece by piece.' },
      { t: 'info', h: 'The stage', p: `When USD opens a file, it builds a <b>stage</b>: the fully composed scene, with every layer and arc already resolved. You never query files directly. You ask the stage.<br><br>In Python: <code>stage = Usd.Stage.Open('scene.usda')</code>` },
      { t: 'mcq', q: 'What is a <b>stage</b>?', o: ['A single USD file on disk', 'The composed scene built from a root layer and everything it pulls in', 'A render pass', 'The Houdini viewport'], a: 1, why: 'A stage is the result of composing a root layer with everything it references, sublayers and so on.' },
      { t: 'info', h: 'Try it on your machine', lang: 'py', code: `# in your usd_learning venv (usd-core is installed)\nfrom pxr import Usd\nprint(Usd.GetVersion())\n\nstage = Usd.Stage.CreateInMemory()\nstage.DefinePrim('/World/Ball', 'Sphere')\nprint(stage.GetRootLayer().ExportToString())`, p: 'Paste this into Python in your venv, or into Houdini\'s Python Shell.', after: 'You\'ll see USD write the .usda text for the prims you just created.' },
      { t: 'info', h: 'Key takeaways', p: `• A USD file is plain text you can read (in .usda form)<br>• Opening it produces a <b>stage</b>, the composed scene you query<br>• The Python modules live in the <code>pxr</code> package` },
    ]},
    { id: 'u1d1', kind: 'drill', title: 'Basics drill', steps: [
      { t: 'mcq', q: 'What does "non-destructive" mean in USD?', o: ['Files can\'t be deleted', 'Changes go into separate layers, so originals are never edited', 'Renders never crash', 'Undo is unlimited'], a: 1, why: 'Overrides live in their own layers above the source.' },
      { t: 'match', q: 'Match.', pairs: [['Layer', 'A file of opinions'], ['Opinion', 'One authored value'], ['Stage', 'The composed scene'], ['Solaris', 'Houdini\'s USD toolset']] },
      { t: 'tf', q: 'Text and crate files can be converted into each other without losing data.', a: true, why: 'They are lossless representations of the same data.' },
      { t: 'mcq', q: 'Which format would you hand to an iPhone AR viewer?', o: ['.usda', '.usdc', '.usdz', '.mtlx'], a: 2, why: '.usdz is the packaged, single-file delivery format.' },
      { t: 'tf', q: 'USD can only read files in its own formats.', a: false, why: 'File format plugins let it read Alembic, MaterialX, OBJ and more.' },
    ]},
  ]
});

// ------------------------------------------------------------ U2
UNITS.push({
  id: 'u2', part: 'p1', title: 'PRIMS & NAMESPACE', sub: 'Prims, paths, properties, specifiers', emoji: '🌳', color: '#58cc02', shadow: '#46a302',
  items: [
    { id: 'u2l1', kind: 'lesson', title: 'Prims & properties', steps: [
      { t: 'info', h: 'Prims', p: `A <b>prim</b> (short for primitive) is the basic building block of a USD scene. It's a <b>node in a hierarchy</b>, a bit like a folder. A prim can hold:<br><br>• <b>child prims</b><br>• <b>properties</b> (the real data)<br>• <b>metadata</b> (extra info about the prim itself)<br><br>Prims are also the unit of instancing, loading and deactivation, as you'll see later.` },
      { t: 'info', h: 'Two kinds of property', p: `<span class="pill g">attribute</span> holds a <b>typed value</b>, possibly animated over time.<br><code>double radius = 2</code><br><br><span class="pill b">relationship</span> <b>points at</b> other prims or properties by path. It never holds a value.<br><code>rel material:binding = &lt;/Mats/Red&gt;</code><br><br>Relationships are how USD says "this mesh uses that material" or "this light lights those objects".` },
      { t: 'widget', w: 'stageTree', h: 'Explore a stage', p: 'Tap prims to see their path, type and properties.' },
      { t: 'mcq', q: 'Which property kind would store <code>radius = 2.5</code>?', o: ['Relationship', 'Attribute', 'Metadata', 'Specifier'], a: 1, why: 'Values live in attributes. Relationships only store target paths.' },
      { t: 'tap', q: 'Tap the <b>relationship</b>.', code: `def Sphere "Ball"\n{\n    double ⟦radius⟧ = 2\n    ⟦rel material:binding⟧ = </Mats/Red>\n    token ⟦visibility⟧ = "inherited"\n}`, a: 1, why: 'Relationships are declared with "rel" and their targets are paths in < >.' },
      { t: 'info', h: 'Namespaced names', p: `Property names can contain colons to group them into <b>namespaces</b>: <code>material:binding</code>, <code>primvars:displayColor</code>, <code>inputs:diffuseColor</code>, <code>xformOp:translate</code>.<br><br>The colon is part of the name. It just keeps related properties together.` },
      { t: 'info', h: 'Key takeaways', p: `• <b>Prim</b> = a node in the scene tree<br>• <b>Attribute</b> = typed value. <b>Relationship</b> = pointer to paths<br>• Colons group property names into namespaces` },
    ]},
    { id: 'u2l2', kind: 'lesson', title: 'Paths', steps: [
      { t: 'info', h: 'Every prim has an address', p: `The tree of prims is called the <b>namespace</b>. Every prim has a unique <b>path</b> written with forward slashes, starting at the root:<br><br><code class="big">/World/Car/Wheel_FL</code><br><br>In .usda text, a path used as a value is wrapped in angle brackets: <code>&lt;/World/Car&gt;</code>.` },
      { t: 'info', h: 'The pseudo-root', p: `Above all your top-level prims sits a hidden <b>pseudo-root</b> whose path is just <code>/</code>. It turns the scene into a single tree, which makes traversal simple.<br><br>Prims directly under it (like <code>/World</code>) are called <b>root prims</b>.` },
      { t: 'info', h: 'Property paths', p: `To address a <b>property</b>, add a dot and its name:<br><br><code class="big">/World/Ball.radius</code><br><code class="big">/World/Ball.primvars:displayColor</code><br><br>Paths can even point inside a variant, using braces: <code>/Car{paint=red}Body</code>. You'll meet variants in Part 2.` },
      { t: 'mcq', q: 'Which is the path to the <b>radius</b> attribute of <b>Ball</b> under <b>World</b>?', o: ['/World/Ball/radius', '/World/Ball.radius', 'World.Ball.radius', '/World:Ball.radius'], a: 1, why: 'Prims are separated by "/" and the property is joined with ".".' },
      { t: 'mcq', q: 'What is the path of the pseudo-root?', o: ['/World', '/', '/root', '.'], a: 1, why: 'The pseudo-root is "/", the parent of every root prim.' },
      { t: 'info', h: 'Naming rules', p: `Prim names must be valid identifiers: letters, digits and underscores, and no spaces. They can't start with a digit (USD now also allows many Unicode letters).<br><br><code>Wheel_FL</code> ✅ &nbsp; <code>2Wheels</code> ❌ &nbsp; <code>my wheel</code> ❌<div class="hou">🟠 <b>Houdini:</b> when SOP geometry is imported, illegal characters in path names are replaced, usually with underscores.</div>` },
      { t: 'tf', q: '<code>/World/Front Door</code> is a valid prim path.', a: false, why: 'Spaces are not allowed in prim names. Use Front_Door.' },
      { t: 'info', h: 'Key takeaways', p: `• Paths look like <code>/A/B/C</code> and are unique<br>• <code>/</code> is the pseudo-root. Root prims sit directly under it<br>• A property path adds <code>.name</code>` },
    ]},
    { id: 'u2l3', kind: 'lesson', title: 'def, over & class', steps: [
      { t: 'info', h: 'Specifiers', p: `Every prim description in a layer starts with a <b>specifier</b> that states the author's intent:<br><br><span class="pill g">def</span> <b>defines</b> the prim: "this exists".<br><span class="pill b">over</span> an <b>override</b>: "<i>if</i> this prim exists, here are my opinions". It's the weakest specifier and doesn't make the prim exist on its own.<br><span class="pill p">class</span> an <b>abstract</b> prim: a template that others inherit from. It isn't traversed or rendered.` },
      { t: 'widget', w: 'specifiers', h: 'Toggle the specifier', p: 'Change each prim\'s specifier and watch what appears in the viewport.' },
      { t: 'info', h: 'How specifiers combine', p: `Several layers can describe the same prim with different specifiers. If <b>any</b> layer says <code>def</code>, the prim is defined, so an <code>over</code> on top of a <code>def</code> still gives you a real prim.<br><br>If <b>every</b> layer only says <code>over</code>, the prim is "undefined": default traversals skip it and it won't render.<br><br>A <code>class</code> prim and <b>everything under it</b> count as abstract.` },
      { t: 'mcq', q: 'A lighting layer only wants to change the colour of /World/Car, which the layout layer defines. Which specifier should lighting use?', o: ['def', 'over', 'class'], a: 1, why: '"over" adds opinions without claiming the prim exists. If layout later removes the car, lighting won\'t accidentally resurrect it.' },
      { t: 'tf', q: 'An "over" with nothing defining the prim underneath shows up in the render.', a: false, why: 'An over alone leaves the prim undefined, and default traversal skips it.' },
      { t: 'tap', q: 'Tap the prim that will <b>not</b> be drawn.', code: `def Xform "World" {\n    def Sphere ⟦"Ball"⟧ {}\n}\nclass Xform ⟦"_class_Tree"⟧ {}\ndef Cube ⟦"Box"⟧ {}`, a: 1, why: 'class prims are abstract, so they aren\'t rendered. The _class_ prefix is only a naming convention.' },
      { t: 'info', h: 'Key takeaways', p: `• <b>def</b> defines, <b>over</b> only overrides, <b>class</b> is an abstract template<br>• Any def anywhere makes the prim real<br>• Studios often name classes <code>_class_Something</code>, but that's just convention` },
    ]},
    { id: 'u2l4', kind: 'lesson', title: 'Active & visible', steps: [
      { t: 'info', h: 'USD never deletes', p: `Since all edits are opinions in layers, you can't really "delete" a prim that a weaker layer defines. Instead you have two switches:<br><br><span class="pill y">active</span> <b>metadata</b>. Setting <code>active = false</code> removes the prim <b>and all its descendants</b> from the composed stage. Their children aren't even composed, which saves memory.<br><br><span class="pill b">visibility</span> an <b>attribute</b> with two values, <code>inherited</code> (the default) and <code>invisible</code>. Invisible hides the prim and everything below it from rendering, but it all still exists and can be inspected.` },
      { t: 'info', h: 'Which one to use?', p: `• Want it <b>gone</b> (and cheaper)? → deactivate.<br>• Want it <b>hidden</b> but still there, for example for a camera to aim at, or to animate it popping in? → <code>visibility = "invisible"</code>. Visibility <b>can be animated</b>; activation can't.<br><br>A stronger layer can set <code>active = true</code> again to bring a prim back.<div class="hou">🟠 <b>Houdini:</b> the <b>Prune LOP</b> can deactivate or hide prims, and the eye and active toggles in the Scene Graph Tree pane edit an unsaved scratch layer.</div>` },
      { t: 'mcq', q: 'You want a building to vanish for a whole shot, and you want USD to stop loading its children. Which?', o: ['visibility = invisible', 'active = false', 'Delete the file', 'purpose = guide'], a: 1, why: 'Deactivation removes the subtree from composition entirely.' },
      { t: 'tf', q: 'Visibility can be animated with time samples.', a: true, why: 'It\'s an attribute, so it can be time-sampled. Activation is metadata and can\'t.' },
      { t: 'match', q: 'Match.', pairs: [['active = false', 'Removed from the stage'], ['visibility = invisible', 'Hidden but still there'], ['visibility = inherited', 'Uses the parent\'s visibility']] },
      { t: 'info', h: 'Key takeaways', p: `• You can't delete opinions from weaker layers. You deactivate or hide instead<br>• <b>active</b> = metadata, removes the subtree<br>• <b>visibility</b> = attribute (<code>inherited</code>/<code>invisible</code>), can be animated` },
    ]},
    { id: 'u2d1', kind: 'drill', title: 'Namespace drill', steps: [
      { t: 'mcq', q: 'A prim is most like…', o: ['A pixel', 'A node / folder in a hierarchy', 'A render pass', 'A shader file'], a: 1, why: 'Prims form the namespace tree.' },
      { t: 'tf', q: 'Relationships store numeric values like 3.5.', a: false, why: 'Attributes store values. Relationships store target paths.' },
      { t: 'mcq', q: 'Which is a valid <b>prim</b> path?', o: ['/World/Car.color', 'World/Car', '/World/Car', '/World//Car'], a: 2, why: 'Absolute prim paths start with "/" and contain no property dot.' },
      { t: 'match', q: 'Match the specifier.', pairs: [['def', 'Defines the prim'], ['over', 'Opinions only'], ['class', 'Abstract template']] },
      { t: 'tf', q: 'An over authored on top of a def leaves the prim defined.', a: true, why: 'If any layer defines it, the prim is defined.' },
      { t: 'mcq', q: 'Which keeps a prim around for a camera to aim at, while not rendering it?', o: ['active = false', 'visibility = invisible', 'class specifier', 'Deleting the layer'], a: 1, why: 'Invisible prims still exist and can be inspected or targeted.' },
      { t: 'order', q: 'Order the parts of a prim declaration.', items: ['def', 'Mesh', '"Rock"', '{ … }'], why: 'specifier → type → name → body' },
    ]},
  ]
});

// ------------------------------------------------------------ U3
UNITS.push({
  id: 'u3', part: 'p1', title: 'READING .USDA', sub: 'The text syntax, line by line', emoji: '📄', color: '#58cc02', shadow: '#46a302',
  items: [
    { id: 'u3l1', kind: 'lesson', title: 'Anatomy of a file', steps: [
      { t: 'info', h: 'The header', lang: 'usda', code: `#usda 1.0\n(\n    defaultPrim = "World"\n    upAxis = "Y"\n    metersPerUnit = 0.01\n    doc = "A tiny demo"\n)`, p: 'Every text layer starts with the magic line <code>#usda 1.0</code>.', after: `Right after it, an optional block in <b>( parentheses )</b> holds <b>layer metadata</b>: settings for the whole file.<br><br>• <code>defaultPrim</code>: which prim to use when someone references this file without naming one<br>• <code>upAxis</code>: <code>"Y"</code> or <code>"Z"</code><br>• <code>metersPerUnit</code>: 0.01 means 1 unit = 1 cm<br>• <code>doc</code>: a free-text description` },
      { t: 'info', h: 'A prim declaration', lang: 'usda', code: `def Xform "World" (\n    kind = "group"\n)\n{\n    def Sphere "Ball"\n    {\n        double radius = 2\n    }\n}`, p: 'The pattern is always: <b>specifier · type · "name" · (metadata) · { body }</b>.', after: `• <code>def</code>: the specifier<br>• <code>Xform</code>: the <b>type name</b> (its schema)<br>• <code>"World"</code>: the prim name, in quotes<br>• <code>( kind = "group" )</code>: optional <b>prim metadata</b><br>• <code>{ … }</code>: the body, holding properties and child prims` },
      { t: 'tap', q: "Tap the prim's <b>type name</b>.", code: `⟦def⟧ ⟦Sphere⟧ ⟦"Ball"⟧\n{\n    double ⟦radius⟧ = 2\n}`, a: 1, why: 'The type name comes after the specifier. Sphere is a UsdGeom schema.' },
      { t: 'tap', q: 'Tap the <b>prim metadata</b> block.', code: `def Xform "Car" ⟦( kind = "component" )⟧\n⟦{⟧\n    double3 ⟦xformOp:translate⟧ = (1, 0, 0)\n}`, a: 0, why: 'Parentheses after the name hold the prim\'s metadata. The braces hold properties and children.' },
      { t: 'info', h: 'Comments & typeless prims', p: `Lines starting with <code>#</code> (after the header) are comments.<br><br>A prim doesn't need a type: <code>def "Stuff" { }</code> is a valid <b>typeless</b> prim, often used as a plain container or as the target of a reference.` },
      { t: 'mcq', q: 'What does <code>metersPerUnit = 0.01</code> mean?', o: ['1 unit = 1 metre', '1 unit = 1 centimetre', 'Everything is scaled by 0.01 at render', 'Nothing; it\'s a comment'], a: 1, why: 'metersPerUnit declares the scene\'s linear unit. 0.01 m is one centimetre.' },
      { t: 'info', h: 'Key takeaways', p: `• <code>#usda 1.0</code> header, then optional <b>layer metadata</b> in ( )<br>• Prims: <b>specifier Type "name" (metadata) { body }</b><br>• Types are optional, and <code>#</code> starts a comment` },
    ]},
    { id: 'u3l2', kind: 'lesson', title: 'Writing properties', steps: [
      { t: 'info', h: 'Attribute syntax', lang: 'usda', code: `double radius = 2\ncolor3f[] primvars:displayColor = [(1, 0.3, 0.2)]\nuniform token subdivisionScheme = "none"\ncustom string studio:note = "hero prop"\nasset inputs:file = @./textures/rust.png@`, p: 'Read each line as: <b>[modifiers] type name = value</b>.', after: `• <code>[]</code> after a type makes it an <b>array</b><br>• <code>uniform</code>: can't be animated<br>• <code>custom</code>: not part of the prim's schema<br>• <code>@…@</code> wraps an <b>asset path</b> (a file reference)` },
      { t: 'info', h: 'Value syntax', p: `• numbers: <code>2</code>, <code>0.5</code><br>• tuples for vectors and colours: <code>(1, 0, 0)</code><br>• arrays: <code>[1, 2, 3]</code> or <code>[(0,0,0), (1,0,0)]</code><br>• strings and tokens: <code>"text"</code><br>• asset paths: <code>@./file.usd@</code> (use <code>@@@…@@@</code> if the path itself contains an @)<br>• paths: <code>&lt;/World/Ball&gt;</code>` },
      { t: 'tap', q: 'Tap the <b>asset path</b>.', code: `def Shader "Tex" {\n    uniform token info:id = ⟦"UsdUVTexture"⟧\n    asset inputs:file = ⟦@./textures/rust.png@⟧\n    float2 inputs:st.connect = ⟦</Mat/Reader.outputs:result>⟧\n}`, a: 1, why: 'Asset paths are wrapped in @ … @ and resolved by the asset resolver.' },
      { t: 'info', h: 'Relationship syntax', lang: 'usda', code: `rel material:binding = </Mats/Red>\nrel proxyPrim = </World/Tree/proxy>\nrel lights = [</L/Key>, </L/Fill>]`, p: 'Relationships use the <code>rel</code> keyword. Their targets are paths in angle brackets, and they can have several targets.' },
      { t: 'fill', q: 'Point the binding at the Red material.', lang: 'usda', code: `def Mesh "Rock"\n{\n    ▢ material:binding = ▢\n}`, blanks: ['rel', '</Mats/Red>'], extra: ['attr', '"Mats/Red"', '@Red@'], why: 'Relationships use "rel" and path targets in angle brackets.' },
      { t: 'fill', q: 'Complete the file.', lang: 'usda', code: `#usda 1.0\n\ndef ▢ "World"\n{\n    def Cube "Box"\n    {\n        double ▢ = 4\n    }\n}`, blanks: ['Xform', 'size'], extra: ['Prim', 'radius', 'Group'], why: 'Xform is a transformable group. Cube has a "size" attribute (Sphere has "radius").' },
      { t: 'info', h: 'Key takeaways', p: `• Attributes: <b>[uniform/custom] type name = value</b><br>• <code>@…@</code> = asset path, <code>&lt;…&gt;</code> = scene path<br>• Relationships: <code>rel name = &lt;/target&gt;</code>` },
    ]},
    { id: 'u3l3', kind: 'lesson', title: 'Metadata', steps: [
      { t: 'info', h: 'What metadata is', p: `<b>Metadata</b> is the lightest kind of data: a name and a value attached to a <b>layer</b>, a <b>prim</b> or a <b>property</b>.<br><br>Two rules:<br>• It <b>can't be animated</b> (no time samples)<br>• It <b>can't have metadata of its own</b><br><br>You've already seen some: <code>kind</code>, <code>active</code>, <code>defaultPrim</code>, <code>upAxis</code>, <code>instanceable</code>.` },
      { t: 'info', h: 'customData & assetInfo', lang: 'usda', code: `def Xform "Chair" (\n    customData = { string pipeline:dept = "props" }\n    assetInfo = {\n        asset identifier = @./chair.usd@\n        string name = "Chair"\n        string version = "v012"\n    }\n)\n{ }`, p: 'You can\'t invent new metadata names without configuring USD, but there are two built-in "anything goes" dictionaries:', after: `• <b>customData</b>: free-form user data<br>• <b>assetInfo</b>: identifies an asset (<code>identifier</code>, <code>name</code>, <code>version</code>, <code>payloadAssetDependencies</code>). It's advisory: USD itself doesn't use it during composition, but pipelines do.` },
      { t: 'mcq', q: 'Where would you store a free-form note like "approved by supervisor"?', o: ['A new metadata key you invent', 'customData', 'defaultPrim', 'kind'], a: 1, why: 'customData is the free-form dictionary for user data. Inventing new metadata keys needs configuration.' },
      { t: 'tf', q: 'Metadata can be animated with time samples.', a: false, why: 'Metadata is never time-varying. Use an attribute if the value must change over time.' },
      { t: 'info', h: 'Dictionaries merge', p: `When several layers author the same metadata, the strongest opinion wins. <b>Dictionaries</b> such as customData are the exception: they <b>merge key by key</b>, so each layer can add its own entries.` },
      { t: 'info', h: 'Key takeaways', p: `• Metadata = name/value on layers, prims or properties, and can't be animated<br>• Use <b>customData</b> for your own data and <b>assetInfo</b> for asset identity<br>• Dictionary metadata merges key by key across layers` },
    ]},
    { id: 'u3d1', kind: 'drill', title: 'Syntax drill', steps: [
      { t: 'tap', q: 'Tap the <b>layer metadata</b> block opener.', code: `#usda 1.0\n⟦(⟧\n    upAxis = "Y"\n)\n\ndef Xform "World" ⟦{⟧ }`, a: 0, why: 'Parentheses right after the header hold layer metadata.' },
      { t: 'match', q: 'Match the syntax.', pairs: [['@./a.usd@', 'Asset path'], ['</World/Ball>', 'Scene path'], ['[1, 2, 3]', 'Array'], ['(1, 0, 0)', 'Vector / tuple']] },
      { t: 'mcq', q: 'What does <code>uniform</code> before an attribute mean?', o: ['Same value on every prim', 'Cannot be animated', 'Must be a colour', 'Read-only in Python'], a: 1, why: 'uniform = no time samples.' },
      { t: 'fill', q: 'Give the asset a version tag.', lang: 'usda', code: `def Xform "Chair" (\n    ▢ = {\n        string version = "v003"\n    }\n)\n{ }`, blanks: ['assetInfo'], extra: ['kind', 'variants', 'apiSchemas'], why: 'assetInfo holds identifier, name and version.' },
      { t: 'tf', q: 'A prim must always have a type name.', a: false, why: 'Typeless prims like def "Stuff" {} are valid.' },
      { t: 'mcq', q: 'Two layers author different keys in customData. What happens?', o: ['Strongest layer\'s whole dictionary wins', 'They merge key by key', 'Error', 'Weakest wins'], a: 1, why: 'Dictionary-valued metadata merges element-wise.' },
    ]},
  ]
});

// ------------------------------------------------------------ U4
UNITS.push({
  id: 'u4', part: 'p1', title: 'SCHEMAS', sub: 'Typed vs API schemas, fallbacks', emoji: '🧱', color: '#58cc02', shadow: '#46a302',
  items: [
    { id: 'u4l1', kind: 'lesson', title: 'Typed (IsA) schemas', steps: [
      { t: 'info', h: 'What a schema is', p: `A <b>schema</b> is a recipe that says "a prim of this kind has these properties, with these defaults, and behaves like this". It gives you a typed C++/Python API, such as <code>sphere.GetRadiusAttr()</code>.<br><br>The prim's <b>type name</b> picks its one <b>typed schema</b> (also called an <b>IsA schema</b>): <code>def Sphere</code> → UsdGeomSphere.` },
      { t: 'info', h: 'Common typed schemas', p: `<b>Xform</b>: a transformable group<br><b>Scope</b>: a group with <b>no transform</b>, for organising (e.g. <code>/Materials</code>)<br><b>Mesh</b>, <b>Sphere</b>, <b>Cube</b>, <b>Cone</b>, <b>Cylinder</b>, <b>Capsule</b>, <b>Plane</b>, <b>Points</b>, <b>BasisCurves</b>: geometry<br><b>Camera</b><br><b>DistantLight</b>, <b>DomeLight</b>, <b>RectLight</b>…: lights<br><b>Material</b>, <b>Shader</b>, <b>NodeGraph</b>: shading<br><b>RenderSettings</b>, <b>RenderProduct</b>, <b>RenderVar</b>: render setup<br><br>Schemas are grouped into <b>domains</b>: <b>UsdGeom</b> (geometry, cameras), <b>UsdLux</b> (lights), <b>UsdShade</b> (materials), <b>UsdSkel</b> (skeletal animation, e.g. <code>SkelRoot</code>), <b>UsdRender</b>, <b>UsdPhysics</b>, <b>UsdVol</b>…` },
      { t: 'mcq', q: 'You need a container for 200 materials. It should never move. Best type?', o: ['Xform', 'Scope', 'Mesh', 'Material'], a: 1, why: 'Scope groups prims without adding a transform.' },
      { t: 'info', h: 'Abstract vs concrete', p: `Schemas form a family tree. Some are <b>abstract</b> base classes you can't create directly (e.g. <b>Imageable</b>: "can be drawn"; <b>Xformable</b>: "can be transformed"; <b>Gprim</b>: "is geometry"). Others are <b>concrete</b>, like Mesh, with a <code>Define()</code> method.<br><br>Asking <code>prim.IsA(UsdGeom.Xformable)</code> is true for Mesh, Xform, Camera…, because they all derive from it.` },
      { t: 'tf', q: 'A prim can have two typed schemas at once, e.g. Mesh and Camera.', a: false, why: 'A prim has exactly one type name, so one typed schema. Extra behaviour comes from API schemas.' },
      { t: 'info', h: 'Fallbacks & the prim definition', p: `Schemas define <b>fallback values</b>: what you get when nothing is authored. A Sphere's radius falls back to 1, visibility to <code>inherited</code>, orientation to <code>rightHanded</code>.<br><br>This keeps files <b>sparse</b>: you only write what differs from the default. The full set of built-in properties and fallbacks is called the prim's <b>prim definition</b>.` },
      { t: 'mcq', q: 'You create <code>def Sphere "S" {}</code> and author nothing. What is its radius?', o: ['0', 'Undefined; Get() errors', 'The schema fallback (1)', '100'], a: 2, why: 'Unauthored built-in attributes return the schema\'s fallback value.' },
      { t: 'info', h: 'Key takeaways', p: `• One <b>typed (IsA)</b> schema per prim, chosen by its type name<br>• Abstract bases (Imageable, Xformable, Gprim) vs concrete types (Mesh, Xform…)<br>• <b>Fallbacks</b> keep scenes sparse` },
    ]},
    { id: 'u4l2', kind: 'lesson', title: 'API schemas', steps: [
      { t: 'info', h: '"Has-a" instead of "is-a"', p: `An <b>API schema</b> adds data and behaviour to a prim <b>without changing its type</b>, like a mix-in or a plug-in component. A Mesh can <i>be</i> a Mesh and <i>have</i> material binding, physics and collision.<br><br>There are three flavours:<br>• <b>Non-applied</b>: just convenience accessors (e.g. <code>UsdModelAPI</code> for kind)<br>• <b>Single-apply</b>: applied once (e.g. <code>MaterialBindingAPI</code>)<br>• <b>Multiple-apply</b>: applied several times under instance names (e.g. <code>CollectionAPI:lightLink</code>)` },
      { t: 'info', h: 'How it looks', lang: 'usda', code: `def Mesh "Rock" (\n    prepend apiSchemas = ["MaterialBindingAPI", "PhysicsRigidBodyAPI", "CollectionAPI:shadow"]\n)\n{\n    rel material:binding = </Mats/Stone>\n}`, p: 'Applied API schemas are recorded in the <code>apiSchemas</code> list metadata.', after: 'Note <code>CollectionAPI:shadow</code>: a multiple-apply schema instance named "shadow".<br><br>In Python, typed schemas are created with <code>Define(stage, path)</code>, and API schemas are added with <code>Apply(prim)</code>, e.g. <code>UsdShade.MaterialBindingAPI.Apply(prim)</code>.' },
      { t: 'mcq', q: 'In Python, how do you add MaterialBindingAPI to an existing prim?', o: ['UsdShade.MaterialBindingAPI.Apply(prim)', 'prim.SetTypeName("MaterialBindingAPI")', 'UsdShade.MaterialBindingAPI.Define(stage, path)', 'prim.AddSchema("binding")'], a: 0, why: 'Applied API schemas use .Apply(prim). Typed schemas use .Define(stage, path).' },
      { t: 'tf', q: '<code>prim.IsA(UsdModelAPI)</code> can return true.', a: false, why: 'IsA only checks typed schemas. Use HasAPI() for API schemas.' },
      { t: 'match', q: 'Match the schema to its family.', pairs: [['Mesh', 'UsdGeom'], ['DomeLight', 'UsdLux'], ['Material', 'UsdShade'], ['SkelRoot', 'UsdSkel']] },
      { t: 'info', h: 'Built-in vs custom properties', p: `Properties that come from a schema are <b>built-in</b>. Anything else you add is <b>custom</b>, marked with the <code>custom</code> keyword in .usda.<br><br>For informal, app-specific data, the convention is the <code>userProperties:</code> namespace, e.g. <code>custom string userProperties:artist</code>.` },
      { t: 'info', h: 'Key takeaways', p: `• API schemas = "has-a" mix-ins, recorded in <code>apiSchemas</code><br>• Non-applied, single-apply and multiple-apply (<code>Name:instance</code>)<br>• Define() typed schemas, Apply() API schemas, check with HasAPI()` },
    ]},
    { id: 'u4d1', kind: 'drill', title: 'Schema drill', steps: [
      { t: 'mcq', q: 'Which changes the prim\'s <b>type name</b>?', o: ['Typed (IsA) schema', 'API schema', 'Both', 'Neither'], a: 0, why: 'One type per prim. API schemas layer on top.' },
      { t: 'tf', q: 'A Scope prim can carry a transform.', a: false, why: 'Scope is deliberately non-transformable.' },
      { t: 'fill', q: 'Apply the collision API.', lang: 'usda', code: `def Mesh "Floor" (\n    prepend ▢ = ["PhysicsCollisionAPI"]\n)\n{}`, blanks: ['apiSchemas'], extra: ['schemas', 'kind', 'references'], why: 'Applied API schemas live in apiSchemas list metadata.' },
      { t: 'match', q: 'Match.', pairs: [['Define()', 'Typed schema → def prim'], ['Apply()', 'Add an API schema'], ['HasAPI()', 'Check an API schema'], ['IsA()', 'Check the typed schema']] },
      { t: 'mcq', q: 'CollectionAPI:lightLink is an example of…', o: ['A typed schema', 'A multiple-apply API schema instance', 'A variant', 'A relationship'], a: 1, why: 'Multiple-apply schemas get an instance name after a colon.' },
      { t: 'tf', q: 'Fallback values are written into your file automatically.', a: false, why: 'Fallbacks come from the schema definition. Files stay sparse.' },
    ]},
  ]
});

// ------------------------------------------------------------ U5
UNITS.push({
  id: 'u5', part: 'p1', title: 'ATTRIBUTES', sub: 'Types, roles, variability, blocks', emoji: '🔢', color: '#58cc02', shadow: '#46a302',
  items: [
    { id: 'u5l1', kind: 'lesson', title: 'Value types', steps: [
      { t: 'info', h: 'Strongly typed', p: `Every attribute has exactly one <b>type</b>, fixed when it's declared:<br><br><code>bool int float double half string</code><br><code>token</code>: an interned string for enum-like values such as <code>"inherited"</code> or <code>"catmullClark"</code><br><code>asset</code>: a file path, written <code>@…@</code><br><code>float2 float3 double3 int3</code>: vectors<br><code>matrix4d quatf quath</code>: transforms and rotations<br>Add <code>[]</code> for arrays: <code>int[] faceVertexCounts</code>` },
      { t: 'info', h: 'token vs string', p: `A <b>token</b> is stored once in a global table and compared super fast, which is ideal for a small fixed set of values that repeat a lot (enums, names).<br><br>A <b>string</b> is for arbitrary text that's unlikely to repeat, like a note or a label.` },
      { t: 'match', q: 'Match the type.', pairs: [['token', 'Enum-like interned string'], ['asset', '@path@ to a file'], ['int[]', 'Array of integers'], ['matrix4d', '4×4 transform']] },
      { t: 'info', h: 'Roles', p: `Some types share the same data but have a <b>role</b> that tells USD how to treat them:<br><br><code>point3f</code>: a position, so it's moved by transforms<br><code>vector3f</code>: a direction, rotated and scaled but not translated<br><code>normal3f</code>: a surface normal, which uses a special inverse-transpose transform<br><code>color3f</code>: a colour, never transformed<br><code>texCoord2f</code>: a UV coordinate<br><br>All five are just floats underneath.` },
      { t: 'mcq', q: 'Which type would you use for a mesh\'s vertex positions?', o: ['float3[]', 'point3f[]', 'vector3f[]', 'color3f[]'], a: 1, why: 'Positions are points, and point3f[] gives them the right role.' },
      { t: 'tf', q: 'A color3f and a point3f are stored differently in memory.', a: false, why: 'Same three floats. The role only changes how they\'re interpreted and transformed.' },
      { t: 'info', h: 'Key takeaways', p: `• One fixed type per attribute. Add <code>[]</code> for arrays<br>• <b>token</b> for enums, <b>string</b> for free text, <b>asset</b> for files<br>• <b>Roles</b> (point, vector, normal, color, texCoord) tell USD how to treat the data` },
    ]},
    { id: 'u5l2', kind: 'lesson', title: 'Variability & blocks', steps: [
      { t: 'info', h: 'varying vs uniform', p: `Attribute <b>variability</b> is either <code>varying</code> (the default, which can be animated) or <code>uniform</code> (meant to stay constant over time).<br><br><code>uniform token subdivisionScheme = "catmullClark"</code><br><br>USD core doesn't actually enforce it. It's a <b>hint</b> that schemas, validators and renderers rely on.` },
      { t: 'tf', q: 'A uniform attribute is meant to be animated with time samples.', a: false, why: 'uniform means time-invariant.' },
      { t: 'info', h: 'Blocking a value', p: `Sometimes you want a stronger layer to say "<b>ignore whatever weaker layers said</b>; this attribute has no value". That's an <b>attribute block</b>:`, lang: 'usda', code: `over "Ball"\n{\n    double radius = None   # blocked!\n}`, after: `The attribute then resolves to its <b>schema fallback</b>, or no value at all. In Python: <code>attr.Block()</code>.<br><br>A newer variant, the <b>animation block</b>, blocks only weaker <i>animation</i> (time samples and splines) and leaves default values visible.` },
      { t: 'mcq', q: 'A weaker layer animates radius. You want the stronger layer to remove ALL of its values. What do you author?', o: ['radius = 0', 'radius = None (a block)', 'active = false', 'delete radius'], a: 1, why: 'Authoring None blocks every weaker opinion.' },
      { t: 'info', h: 'Connections', p: `An attribute can also carry a <b>connection</b>: a pointer to another attribute it should take its value from. This is how shading networks are wired:<br><br><code>color3f inputs:diffuseColor.connect = &lt;/Mat/Tex.outputs:rgb&gt;</code><br><br>USD stores connections but doesn't compute anything through them. Renderers do. You'll use them a lot in the materials unit.` },
      { t: 'info', h: 'Key takeaways', p: `• <b>varying</b> (default) vs <b>uniform</b>: a hint, not enforced<br>• <code>= None</code> <b>blocks</b> weaker opinions<br>• <code>.connect</code> wires attributes together (mostly for shading)` },
    ]},
    { id: 'u5d1', kind: 'drill', title: 'Attribute drill', steps: [
      { t: 'mcq', q: 'Which role should a surface normal use?', o: ['point3f', 'vector3f', 'normal3f', 'color3f'], a: 2, why: 'Normals transform with the inverse-transpose, so they get their own role.' },
      { t: 'tap', q: 'Tap what keeps this attribute from being animated.', code: `⟦uniform⟧ ⟦token⟧ ⟦subdivisionScheme⟧ = ⟦"none"⟧`, a: 0, why: 'uniform = time-invariant.' },
      { t: 'fill', q: 'Block the weaker radius.', lang: 'usda', code: `over "Ball" {\n    double radius = ▢\n}`, blanks: ['None'], extra: ['0', 'null', 'delete'], why: 'None is the block value.' },
      { t: 'mcq', q: 'Best type for a "subdivision scheme" value with four possible choices?', o: ['string', 'token', 'asset', 'int'], a: 1, why: 'Tokens are for small enum-like sets.' },
      { t: 'tf', q: 'USD itself evaluates attribute connections to compute shader results.', a: false, why: 'USD stores connections. Renderers interpret them.' },
    ]},
  ]
});

// ------------------------------------------------------------ U6
UNITS.push({
  id: 'u6', part: 'p1', title: 'TIME & ANIMATION', sub: 'Time codes, samples, interpolation', emoji: '⏱️', color: '#58cc02', shadow: '#46a302',
  items: [
    { id: 'u6l1', kind: 'lesson', title: 'Default vs time samples', steps: [
      { t: 'info', h: 'Two places for a value', p: `Each attribute has two separate slots for values:<br><br>1️⃣ the <b>default</b>: a value "for no particular time"<br>2️⃣ <b>timeSamples</b>: a map of time → value`, lang: 'usda', code: `double3 xformOp:translate = (0, 0, 0)\ndouble3 xformOp:translate.timeSamples = {\n    1: (0, 0, 0),\n    12: (0, 5, 0),\n    24: (0, 0, 0),\n}`, after: 'Both can be authored at once. When they are, the samples win (see below).' },
      { t: 'info', h: 'Time codes', p: `Times in USD are <b>time codes</b>: unitless double-precision numbers. Usually 1 time code = 1 frame.<br><br>Layer metadata says how to map them to real time:<br><code>timeCodesPerSecond = 24</code> (the default is 24)<br><code>startTimeCode = 1</code> · <code>endTimeCode = 240</code><br><br>(<code>framesPerSecond</code> also exists, but it's a playback hint for applications.)` },
      { t: 'widget', w: 'timeSamples', h: 'Scrub the timeline', p: 'Drag the frame slider. Between samples USD interpolates <b>linearly</b> by default. Switch to <b>held</b> to see the difference.' },
      { t: 'info', h: 'Interpolation rules', p: `• Between two samples, values are <b>linearly interpolated</b> by default. A stage can switch to <b>held</b> (stepped) interpolation: <code>stage.SetInterpolationType(Usd.InterpolationTypeHeld)</code>.<br>• Types that can't be blended (strings, tokens, bools, ints) are always held.<br>• Before the first sample or after the last, the nearest sample is <b>held</b>.<br>• Newer USD versions also support <b>splines</b> (curve-based animation with knots).` },
      { t: 'mcq', q: 'Samples: frame 10 → 0, frame 20 → 10. Linear interpolation. Value at frame 15?', o: ['0', '5', '10', '7.5'], a: 1, why: 'Halfway between the samples gives 5.' },
      { t: 'mcq', q: 'Same samples. Value at frame 50?', o: ['10', '0', '50', 'No value'], a: 0, why: 'Past the last sample, it holds at 10.' },
      { t: 'info', h: 'Key takeaways', p: `• Default value + timeSamples are separate slots<br>• Time codes are unitless. <code>timeCodesPerSecond</code> maps them to seconds<br>• Linear between samples, held outside. Non-numeric types are always held` },
    ]},
    { id: 'u6l2', kind: 'lesson', title: 'Value resolution', steps: [
      { t: 'info', h: 'How USD picks a value', p: `To get an attribute's value at a time, USD walks the contributing opinions from <b>strongest to weakest</b>. At each one it checks, in order:<br><br>1. <b>timeSamples</b><br>2. <b>splines</b><br>3. the <b>default</b><br>4. <b>value clips</b> (an advanced feature)<br><br>The <b>first opinion that has anything</b> wins. If nothing is authored anywhere, you get the schema <b>fallback</b>.` },
      { t: 'info', h: 'The classic gotcha', p: `This means that <b>within one layer</b>, time samples beat the default. But <b>across layers</b>, the stronger layer wins <b>even if it only has a default</b>.<br><br>So if lighting writes <code>translate = (0,0,0)</code> as a default, the animator's samples in a weaker layer are <b>completely hidden</b>.<div class="warn">⚠️ This is one of the most common "my animation disappeared!" bugs in USD pipelines.</div>` },
      { t: 'tf', q: 'A weaker layer\'s animation overrides a stronger layer\'s default value.', a: false, why: 'The strongest layer with any opinion wins, even if it\'s only a default.' },
      { t: 'mcq', q: 'In ONE layer, an attribute has default = 3 and samples {1: 0, 10: 9}. Value at frame 5?', o: ['3', '4', '0', '9'], a: 1, why: 'Samples beat the default in the same layer. Linear: 0 + 9×(4/9) = 4.' },
      { t: 'info', h: 'Querying time in code', lang: 'py', code: `attr.Get()                      # the DEFAULT time\nattr.Get(24)                    # at frame 24\nattr.Get(Usd.TimeCode(24))      # same\nattr.Get(Usd.TimeCode.EarliestTime())\nattr.GetTimeSamples()           # [1.0, 12.0, 24.0]`, p: 'In Python:', after: `<div class="warn">⚠️ <code>Get()</code> with no time asks for the <b>Default</b> time code, which <b>ignores time samples</b>. For animated attributes, pass a time or use <code>EarliestTime()</code>.</div>` },
      { t: 'mcq', q: 'An attribute has only time samples (no default). What does <code>attr.Get()</code> with no argument return?', o: ['The first sample', 'None, because the Default time ignores samples', 'The average', 'An error'], a: 1, why: 'The Default time code only looks at default values.' },
      { t: 'info', h: 'Key takeaways', p: `• Per opinion: samples → splines → default → clips, strongest opinion first<br>• A stronger <b>default</b> hides weaker <b>animation</b><br>• <code>Get()</code> means Default time, so pass a time for animated values` },
    ]},
    { id: 'u6d1', kind: 'drill', title: 'Time drill', steps: [
      { t: 'mcq', q: 'Samples: 1 → 0, 11 → 100. Value at frame 6 (linear)?', o: ['50', '60', '100', '0'], a: 0, why: '(6−1)/(11−1) = 0.5, so 50.' },
      { t: 'tf', q: 'Before the first time sample, USD holds the first sample\'s value.', a: true, why: 'Values are held outside the sampled range.' },
      { t: 'mcq', q: 'A token attribute has samples "open" at 1 and "closed" at 10. Value at 5?', o: ['"open"', '"closed"', 'Halfway', 'None'], a: 0, why: 'Non-interpolatable types are held.' },
      { t: 'mcq', q: 'Which layer metadata sets how many time codes make one second?', o: ['framesPerSecond', 'timeCodesPerSecond', 'startTimeCode', 'metersPerUnit'], a: 1, why: 'timeCodesPerSecond maps time codes to seconds.' },
      { t: 'order', q: 'Order of sources USD checks within each opinion.', items: ['timeSamples', 'splines', 'default', 'value clips'], why: 'Samples → splines → default → clips.' },
      { t: 'tf', q: 'attr.Get(12) returns the interpolated value at frame 12.', a: true, why: 'Passing a time evaluates the animation.' },
    ]},
    { id: 'u6c1', kind: 'challenge', title: 'Foundations boss', timed: true, steps: [
      { t: 'mcq', q: 'Path to the radius of /World/Ball?', o: ['/World/Ball/radius', '/World/Ball.radius', 'World:Ball:radius'], a: 1, why: '"." for properties.' },
      { t: 'mcq', q: 'Which specifier is only an override?', o: ['def', 'over', 'class'], a: 1, why: 'over.' },
      { t: 'tf', q: 'Deactivating a prim also removes its children from the stage.', a: true, why: 'The whole subtree is pruned.' },
      { t: 'mcq', q: 'Free-form pipeline notes go in…', o: ['customData', 'kind', 'apiSchemas'], a: 0, why: 'customData.' },
      { t: 'mcq', q: 'A mix-in like MaterialBindingAPI is a…', o: ['Typed schema', 'API schema', 'Variant'], a: 1, why: 'API schema.' },
      { t: 'mcq', q: '<code>double radius = None</code> means…', o: ['radius is 0', 'radius is blocked', 'syntax error'], a: 1, why: 'A block.' },
      { t: 'tf', q: 'A stronger default hides weaker time samples.', a: true, why: 'Strongest opinion wins.' },
      { t: 'mcq', q: '.usdc is…', o: ['text', 'binary crate', 'a zip'], a: 1, why: 'Crate.' },
    ]},
  ]
});
