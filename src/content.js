// ============================================================
//  CURRICULUM
//  Step / question types:
//   info   {h, p(html), code?, lang?}
//   widget {w, h, p, opts?}
//   mcq    {q, code?, o:[], a, why}
//   tf     {q, a:bool, why}
//   tap    {q, code (tappables in ⟦ ⟧), a:index, why}
//   order  {q, items:[correct order], why}
//   match  {q, pairs:[[l,r]]}
//   fill   {q, code (blanks = ▢), blanks:[], extra:[], why}
// ============================================================

const UNITS = [
// ------------------------------------------------------------ 1
{
  id: 'u1', title: 'STAGE BASICS', sub: 'Files, stages, prims and paths', emoji: '🌱', color: '#58cc02', shadow: '#46a302',
  items: [
    { id: 'u1l1', kind: 'lesson', title: 'What is OpenUSD?', steps: [
      { t: 'info', h: 'Universal Scene Description', p: `OpenUSD is <b>two things at once</b>: a file format for 3D scenes, and a C++/Python library that reads lots of those files and <b>composes</b> them into one scene.<br><br>Pixar built it so hundreds of artists (and tools like Houdini, Maya, Blender, Omniverse) could work on the <i>same</i> shot at the same time without overwriting each other.` },
      { t: 'info', h: 'Three flavours of file', p: `<div class="pills"><span class="pill g">.usda</span> human-readable <b>text</b><br><span class="pill b">.usdc</span> binary <b>"crate"</b>: compact and fast to load<br><span class="pill p">.usdz</span> an uncompressed <b>zip package</b>, mostly used for delivery and AR</div><br><span class="pill y">.usd</span> can be <i>either</i> text or binary. The library sniffs the contents.` },
      { t: 'mcq', q: 'You want to open a file in a text editor and read it. Which extension?', o: ['.usdc', '.usda', '.usdz', '.abc'], a: 1, why: '.usda is the ASCII/text form. .usdc is binary crate, .usdz is a zip package.' },
      { t: 'info', h: 'The big idea: opinions', p: `Nobody edits the original asset. Instead, each department writes <b>opinions</b> into its own file (a <b>layer</b>). USD stacks the layers and the <b>strongest opinion wins</b>.<br><br>Lighting can make the car red without touching the modeller's file. That's what "non-destructive" means.` },
      { t: 'tf', q: 'A file ending in .usd is always binary.', a: false, why: '.usd can hold either text or crate data. Only .usda and .usdc force a format.' },
      { t: 'mcq', q: 'What does USD do with several files that all describe the same prim?', o: ['Throws an error', 'Uses the newest file', 'Composes them; the strongest opinion wins', 'Averages the values'], a: 2, why: 'Composition + strength ordering is the heart of USD.' },
    ]},
    { id: 'u1l2', kind: 'lesson', title: 'Stage, prims & paths', steps: [
      { t: 'info', h: 'The Stage', p: `The <b>stage</b> is the final, composed scene you query, the result of all the layers combined. In Python: <code>Usd.Stage.Open('shot.usda')</code>.` },
      { t: 'info', h: 'Prims & properties', p: `A <b>prim</b> is a node in the scene hierarchy, a bit like a folder. Prims hold <b>properties</b>:<br><br>• <b>attributes</b> hold values (<code>radius = 2</code>)<br>• <b>relationships</b> point at other paths (<code>rel material:binding = &lt;/Mats/Red&gt;</code>)` },
      { t: 'widget', w: 'stageTree', h: 'Explore a stage', p: 'Tap prims to see their path and type.' },
      { t: 'info', h: 'Paths', p: `Every prim has a unique <b>path</b>. Paths start at the pseudo-root <code>/</code> and nest with <code>/</code>:<br><br><code class="big">/World/Car/Wheel_FL</code><br><br>A <b>property</b> path adds a dot:<br><code class="big">/World/Ball.radius</code>` },
      { t: 'mcq', q: 'Which is the path to the <b>radius</b> attribute of prim <b>Ball</b> under <b>World</b>?', o: ['/World/Ball/radius', '/World/Ball.radius', 'World.Ball.radius', '/World:Ball.radius'], a: 1, why: 'Prims are separated by "/", and a property is joined with ".".' },
      { t: 'tap', q: 'Tap the <b>relationship</b>.', code: `def Sphere "Ball"\n{\n    double ⟦radius⟧ = 2\n    ⟦rel material:binding⟧ = </Mats/Red>\n    token ⟦visibility⟧ = "inherited"\n}`, a: 1, why: 'Relationships are declared with "rel" and target paths in < >.' },
    ]},
    { id: 'u1l3', kind: 'lesson', title: 'Reading .usda', steps: [
      { t: 'info', h: 'Your first file', lang: 'usda', code: `#usda 1.0\n(\n    defaultPrim = "World"\n    upAxis = "Y"\n    metersPerUnit = 0.01\n)\n\ndef Xform "World"\n{\n    def Sphere "Ball"\n    {\n        double radius = 2\n        color3f[] primvars:displayColor = [(1, 0.3, 0.2)]\n    }\n}`, p: 'Read it top to bottom. The next cards break it down.' },
      { t: 'info', h: 'Anatomy', p: `<b>#usda 1.0</b>: the magic header line<br><b>( … )</b>: <i>layer metadata</i> (defaultPrim, upAxis, units)<br><b>def</b>: the <i>specifier</i><br><b>Xform</b>: the <i>type name</i> (schema)<br><b>"World"</b>: the prim's <i>name</i><br><b>double radius = 2</b>: attribute: <i>type</i>, <i>name</i>, <i>value</i>` },
      { t: 'tap', q: "Tap the prim's <b>type name</b>.", code: `⟦def⟧ ⟦Sphere⟧ ⟦"Ball"⟧\n{\n    double ⟦radius⟧ = 2\n}`, a: 1, why: 'The type name comes after the specifier. Sphere is a schema type from UsdGeom.' },
      { t: 'fill', q: 'Complete the file.', lang: 'usda', code: `#usda 1.0\n\ndef ▢ "World"\n{\n    def Cube "Box"\n    {\n        double ▢ = 4\n    }\n}`, blanks: ['Xform', 'size'], extra: ['Prim', 'radius', 'Group'], why: 'Xform is a transformable grouping prim. Cube has a "size" attribute (Sphere has "radius").' },
      { t: 'mcq', q: 'What does <b>defaultPrim</b> do?', o: ['Makes the prim visible', 'Names the prim used when another file references this layer without a path', 'Sets the camera', 'Marks the prim as the root of the stage'], a: 1, why: 'A reference with no prim path targets the layer\'s defaultPrim. Always set it on assets!' },
      { t: 'info', h: 'Try it on your machine', lang: 'py', code: `# in your usd_learning venv (usd-core is installed)\nfrom pxr import Usd\nprint(Usd.GetVersion())\n\nstage = Usd.Stage.CreateInMemory()\nstage.DefinePrim('/World/Ball', 'Sphere')\nprint(stage.GetRootLayer().ExportToString())`, p: 'Paste this into Python from your usd_learning venv, or into the Python Shell in Houdini.' },
    ]},
    { id: 'u1d1', kind: 'drill', title: 'Stage drill', steps: [
      { t: 'match', q: 'Match the extension.', pairs: [['.usda', 'Text'], ['.usdc', 'Binary crate'], ['.usdz', 'Zip package'], ['.usd', 'Either']] },
      { t: 'mcq', q: 'A prim is most like…', o: ['A pixel', 'A node / folder in a hierarchy', 'A render pass', 'A shader'], a: 1, why: 'Prims form the namespace tree of the scene.' },
      { t: 'tf', q: 'Relationships store numeric values like 3.5.', a: false, why: 'Attributes store values. Relationships store target paths.' },
      { t: 'mcq', q: 'What is the root of every path?', o: ['/World', '/', '.', 'root:'], a: 1, why: 'The pseudo-root "/" sits above every prim.' },
      { t: 'tap', q: 'Tap the <b>layer metadata</b> block opener.', code: `#usda 1.0\n⟦(⟧\n    upAxis = "Y"\n)\n\ndef Xform "World" ⟦{⟧ }`, a: 0, why: 'Parentheses right after the header hold layer metadata.' },
      { t: 'order', q: 'Order the parts of a prim declaration.', items: ['def', 'Mesh', '"Rock"', '{ … }'], why: 'specifier → type → name → body' },
      { t: 'fill', q: 'Point the binding at the Red material.', lang: 'usda', code: `def Mesh "Rock"\n{\n    ▢ material:binding = ▢\n}`, blanks: ['rel', '</Mats/Red>'], extra: ['attr', '"Mats/Red"', '@Red@'], why: 'Relationships use "rel" and paths in angle brackets.' },
      { t: 'mcq', q: 'Which of these is a valid <b>prim</b> path?', o: ['/World/Car.color', 'World/Car', '/World/Car', '/World//Car'], a: 2, why: 'Absolute prim paths start with "/" and have no property dot.' },
    ]},
  ]
},
// ------------------------------------------------------------ 2
{
  id: 'u2', title: 'PRIMS & SCHEMAS', sub: 'Specifiers, types, kinds', emoji: '🧱', color: '#1cb0f6', shadow: '#1899d6',
  items: [
    { id: 'u2l1', kind: 'lesson', title: 'def, over & class', steps: [
      { t: 'info', h: 'Specifiers', p: `Every prim spec has a <b>specifier</b>:<br><br><span class="pill g">def</span> "this prim exists". It's defined.<br><span class="pill b">over</span> "<i>if</i> this prim exists, here are my opinions". It's an override that defines nothing on its own.<br><span class="pill p">class</span> an abstract prim, used as a base for <b>inherits</b>. It isn't traversed or rendered.` },
      { t: 'widget', w: 'specifiers', h: 'Toggle the specifier', p: 'Change each prim\'s specifier and watch what appears in the viewport.' },
      { t: 'mcq', q: 'A lighting layer only wants to change the colour of /World/Car, which the layout layer defines. What specifier should lighting use?', o: ['def', 'over', 'class', 'variant'], a: 1, why: '"over" adds opinions without claiming the prim exists, so if layout removes the car, lighting doesn\'t accidentally resurrect it.' },
      { t: 'tf', q: 'An "over" on its own (with nothing defining the prim) shows up in the render.', a: false, why: 'An over with no def underneath it leaves an undefined prim. Default traversal skips it.' },
      { t: 'tap', q: 'Tap the prim that will <b>not</b> be drawn.', code: `def Xform "World" {\n    def Sphere ⟦"Ball"⟧ {}\n}\nclass Xform ⟦"_class_Tree"⟧ {}\ndef Cube ⟦"Box"⟧ {}`, a: 1, why: 'class prims are abstract. They exist to be inherited from.' },
    ]},
    { id: 'u2l2', kind: 'lesson', title: 'Schemas', steps: [
      { t: 'info', h: 'Typed (IsA) schemas', p: `The <b>type name</b> gives a prim its built-in attributes and behaviour:<br><br><b>Xform</b>: a transformable group<br><b>Scope</b>: a group with <i>no</i> transform, for organising<br><b>Mesh</b>, <b>Sphere</b>, <b>Cube</b>, <b>Cylinder</b>: geometry ("gprims")<br><b>Camera</b><br><b>DistantLight</b>, <b>DomeLight</b>, <b>RectLight</b>: UsdLux lights<br><b>Material</b>, <b>Shader</b>: UsdShade` },
      { t: 'mcq', q: 'You need a container for 200 materials. It should never move. Best type?', o: ['Xform', 'Scope', 'Mesh', 'Material'], a: 1, why: 'Scope groups prims without adding a transform. It\'s ideal for /Materials, /Lights, etc.' },
      { t: 'info', h: 'API (applied) schemas', p: `<b>API schemas</b> are <i>mix-ins</i>: they add attributes and behaviour to any prim without changing its type.`, lang: 'usda', code: `def Mesh "Rock" (\n    prepend apiSchemas = ["MaterialBindingAPI", "PhysicsRigidBodyAPI"]\n)\n{\n    rel material:binding = </Mats/Stone>\n}` },
      { t: 'mcq', q: 'In Python, how do you add MaterialBindingAPI to a prim?', o: ['UsdShade.MaterialBindingAPI.Apply(prim)', 'prim.SetTypeName("MaterialBindingAPI")', 'UsdShade.MaterialBindingAPI.Define(stage, path)', 'prim.AddSchema("binding")'], a: 0, why: 'Applied API schemas use .Apply(prim). Typed schemas use .Define(stage, path).' },
      { t: 'match', q: 'Match the schema to its family.', pairs: [['Mesh', 'UsdGeom'], ['DomeLight', 'UsdLux'], ['Material', 'UsdShade'], ['SkelRoot', 'UsdSkel']] },
    ]},
    { id: 'u2l3', kind: 'lesson', title: 'Kind & purpose', steps: [
      { t: 'info', h: 'Kind: the model hierarchy', p: `<b>kind</b> metadata tells tools how "important" a prim is:<br><br><span class="pill p">assembly</span> a big published set (e.g. a city block)<br><span class="pill b">group</span> an organising branch<br><span class="pill g">component</span> a <b>leaf asset</b> (a chair, a tree)<br><span class="pill y">subcomponent</span> an important part <i>inside</i> a component` },
      { t: 'info', h: 'The rules', p: `• A <b>component</b> is the bottom of the model hierarchy. You can't put a model inside a component.<br>• Every ancestor of a component must be a <b>group</b> or <b>assembly</b> (assembly is a kind of group).<br><br>Get this right and tools can quickly "find all assets" without walking every mesh.`, lang: 'usda', code: `def Xform "Chair" (\n    kind = "component"\n)\n{ … }` },
      { t: 'order', q: 'Order from broadest to narrowest.', items: ['assembly', 'group', 'component', 'subcomponent'], why: 'assembly ⊃ group ⊃ component ⊃ subcomponent' },
      { t: 'info', h: 'Purpose', p: `<b>purpose</b> controls when a prim is drawn:<br><br><b>default</b>: always<br><b>render</b>: final-quality renders only<br><b>proxy</b>: lightweight stand-in for the viewport<br><b>guide</b>: helpers such as rig curves and bounds, hidden by default` },
      { t: 'mcq', q: 'Your viewport should show a 500-poly tree, while Karma renders the 2M-poly version. Purposes?', o: ['render + guide', 'proxy + render', 'default + guide', 'proxy + default'], a: 1, why: 'proxy is for interactive display, render is for final frames.' },
    ]},
    { id: 'u2d1', kind: 'drill', title: 'Schema drill', steps: [
      { t: 'match', q: 'Match the specifier.', pairs: [['def', 'Defines the prim'], ['over', 'Opinions only'], ['class', 'Abstract base']] },
      { t: 'tf', q: 'A Scope prim can carry a transform.', a: false, why: 'Scope is deliberately non-transformable. Use Xform if you need to move it.' },
      { t: 'mcq', q: 'Which kind should a single published prop like "Teapot" have?', o: ['assembly', 'group', 'component', 'subcomponent'], a: 2, why: 'Leaf assets are components.' },
      { t: 'mcq', q: 'Which is invalid?', o: ['assembly › group › component', 'group › component', 'component › component', 'assembly › component'], a: 2, why: 'Components cannot contain other models.' },
      { t: 'fill', q: 'Apply the collision API.', lang: 'usda', code: `def Mesh "Floor" (\n    prepend ▢ = ["PhysicsCollisionAPI"]\n)\n{}`, blanks: ['apiSchemas'], extra: ['schemas', 'kind', 'references'], why: 'apiSchemas is list-op metadata on the prim.' },
      { t: 'match', q: 'Match the purpose.', pairs: [['proxy', 'Fast viewport stand-in'], ['render', 'Final frames only'], ['guide', 'Helper, hidden by default'], ['default', 'Always drawn']] },
      { t: 'mcq', q: 'Typed schema vs API schema: which changes the prim\'s <b>type name</b>?', o: ['Typed (IsA)', 'API (applied)', 'Both', 'Neither'], a: 0, why: 'A prim has exactly one type, and API schemas are layered on top of it.' },
    ]},
  ]
},
// ------------------------------------------------------------ 3
{
  id: 'u3', title: 'ATTRIBUTES & TIME', sub: 'Types, xforms, samples, primvars', emoji: '⏱️', color: '#ffc800', shadow: '#e0a800',
  items: [
    { id: 'u3l1', kind: 'lesson', title: 'Attribute types', steps: [
      { t: 'info', h: 'Value types', p: `Attributes are strongly typed:<br><br><code>bool int float double string</code><br><code>token</code> an interned string, used for enums like <code>"inherited"</code><br><code>asset</code> a file path written <code>@./tex.png@</code><br><code>float3 double3 color3f matrix4d quatf</code><br>Add <code>[]</code> for arrays: <code>point3f[] points</code>` },
      { t: 'info', h: 'Roles', p: `<code>point3f</code>, <code>vector3f</code>, <code>normal3f</code> and <code>color3f</code> are all three floats, but the <b>role</b> tells USD how to treat them. Points get translated, vectors don't, normals transform differently, and colours are never transformed.` },
      { t: 'tap', q: 'Tap the <b>asset path</b>.', code: `def Shader "Tex" {\n    uniform token info:id = ⟦"UsdUVTexture"⟧\n    asset inputs:file = ⟦@./textures/rust.png@⟧\n    float2 inputs:st.connect = ⟦</Mat/Reader.outputs:result>⟧\n}`, a: 1, why: 'Asset paths are wrapped in @ … @ and are resolved by the asset resolver (Ar).' },
      { t: 'info', h: 'uniform & custom', p: `<b>uniform</b>: the value can't change over time (no time samples), e.g. <code>uniform token subdivisionScheme</code>.<br><br><b>custom</b>: marks an attribute that isn't part of the prim's schema, e.g. <code>custom string studio:assetId = "chr_042"</code>.` },
      { t: 'mcq', q: 'Which type would you use for a mesh\'s vertex positions?', o: ['float3', 'point3f[]', 'vector3f[]', 'color3f[]'], a: 1, why: 'An array of points: point3f[] points = [...]' },
      { t: 'tf', q: 'A uniform attribute can be animated with time samples.', a: false, why: 'uniform means time-invariant.' },
    ]},
    { id: 'u3l2', kind: 'lesson', title: 'Transforms', steps: [
      { t: 'info', h: 'xformOps', p: `Xformable prims build their matrix from a list of <b>xform ops</b>. Each op is an attribute, and <code>xformOpOrder</code> says which to use, in what order:`, lang: 'usda', code: `double3 xformOp:translate = (0, 5, 0)\nfloat3 xformOp:rotateXYZ = (0, 45, 0)\nfloat3 xformOp:scale = (2, 2, 2)\nuniform token[] xformOpOrder = [\n    "xformOp:translate", "xformOp:rotateXYZ", "xformOp:scale"\n]` },
      { t: 'info', h: 'Read it right to left', p: `Points are transformed by the op at the <b>end</b> of the list first. With <code>[translate, rotate, scale]</code> the object is <b>scaled</b>, then <b>rotated</b>, then <b>translated</b>. That's the classic TRS you want 99% of the time.` },
      { t: 'widget', w: 'xformOrder', h: 'Order matters', p: 'Reorder the ops and watch the box. Try putting translate last.' },
      { t: 'mcq', q: 'With xformOpOrder = [translate, rotateXYZ, scale], which op is applied to the points <b>first</b>?', o: ['translate', 'rotateXYZ', 'scale', 'They\'re simultaneous'], a: 2, why: 'The list reads outer → inner, so the last op touches the points first.' },
      { t: 'tf', q: 'Authoring xformOp:translate without adding it to xformOpOrder still moves the prim.', a: false, why: 'Only ops listed in xformOpOrder are used.' },
      { t: 'info', h: 'Easy mode', lang: 'py', code: `from pxr import UsdGeom\napi = UsdGeom.XformCommonAPI(prim)\napi.SetTranslate((0, 5, 0))\napi.SetRotate((0, 45, 0))\napi.SetScale((2, 2, 2))`, p: '<b>XformCommonAPI</b> writes the standard ops in a standard order for you.' },
    ]},
    { id: 'u3l3', kind: 'lesson', title: 'Time samples', steps: [
      { t: 'info', h: 'Default vs time samples', p: `An attribute can have a <b>default</b> value (for "no particular time") and/or <b>timeSamples</b>:`, lang: 'usda', code: `double3 xformOp:translate = (0, 0, 0)\ndouble3 xformOp:translate.timeSamples = {\n    1: (0, 0, 0),\n    12: (0, 5, 0),\n    24: (0, 0, 0),\n}` },
      { t: 'widget', w: 'timeSamples', h: 'Scrub the timeline', p: 'Drag the frame slider. Between samples USD interpolates <b>linearly</b> by default. Switch to <b>held</b> to see the difference.' },
      { t: 'info', h: 'Resolution rules', p: `• Within one layer, <b>time samples beat the default</b>.<br>• Across layers, the <b>strongest layer with any value</b> wins. So a default in a stronger layer hides animation in a weaker one!<br>• Before the first sample or after the last, the value is <b>held</b>.<br><br>Stage metadata <code>startTimeCode</code>, <code>endTimeCode</code> and <code>timeCodesPerSecond</code> (default 24) describe the range.` },
      { t: 'mcq', q: 'Samples: frame 10 → 0, frame 20 → 10. Linear interpolation. Value at frame 15?', o: ['0', '5', '10', '7.5'], a: 1, why: 'Halfway between the samples gives 5.' },
      { t: 'mcq', q: 'Same samples. Value at frame 50?', o: ['10', '0', '50', 'No value'], a: 0, why: 'Outside the sampled range the nearest sample is held.' },
      { t: 'tf', q: 'A weaker layer\'s animation overrides a stronger layer\'s default value.', a: false, why: 'The strongest layer with any opinion wins, even if it\'s only a default.' },
    ]},
    { id: 'u3l4', kind: 'lesson', title: 'Primvars', steps: [
      { t: 'info', h: 'Primitive variables', p: `<b>Primvars</b> are attributes that can <b>vary across a surface</b> and are handed to shaders: colours, UVs, wetness masks… They live in the <code>primvars:</code> namespace:<br><br><code>color3f[] primvars:displayColor</code><br><code>texCoord2f[] primvars:st</code> (UVs)` },
      { t: 'widget', w: 'primvarInterp', h: 'Interpolation', p: 'Pick an interpolation and see how many values the mesh needs.' },
      { t: 'match', q: 'Match interpolation to "one value per…"', pairs: [['constant', 'whole prim'], ['uniform', 'face'], ['vertex', 'point'], ['faceVarying', 'face-vertex (corner)']] },
      { t: 'info', h: 'Indexed & inherited', p: `• <b>Indexed</b> primvars store a small value array plus <code>primvars:st:indices</code>, which saves memory.<br>• <b>constant</b> primvars authored on an ancestor are <b>inherited</b> by descendant gprims. Set <code>displayColor</code> on a group and every child gets it.` },
      { t: 'mcq', q: 'UVs with seams (a corner has different UVs per face) need…', o: ['constant', 'uniform', 'vertex', 'faceVarying'], a: 3, why: 'faceVarying stores a value per face-corner, so shared points can differ per face.' },
    ]},
    { id: 'u3d1', kind: 'drill', title: 'Attribute drill', steps: [
      { t: 'match', q: 'Match the type.', pairs: [['token', 'Interned enum-ish string'], ['asset', '@path@ to a file'], ['point3f[]', 'Mesh positions'], ['matrix4d', '4×4 transform']] },
      { t: 'order', q: 'Build a standard xformOpOrder.', items: ['xformOp:translate', 'xformOp:rotateXYZ', 'xformOp:scale'], why: 'Translate · Rotate · Scale. Points get scaled first.' },
      { t: 'mcq', q: 'Samples: 1 → 0, 11 → 100. Value at frame 6 (linear)?', o: ['50', '60', '100', '0'], a: 0, why: '(6-1)/(11-1) = 0.5 → 50' },
      { t: 'tf', q: 'Before the first time sample, USD holds the first sample\'s value.', a: true, why: 'Values are held outside the sampled range.' },
      { t: 'fill', q: 'Give the mesh per-point colours.', lang: 'usda', code: `color3f[] primvars:▢ = [(1,0,0), (0,1,0), …] (\n    interpolation = "▢"\n)`, blanks: ['displayColor', 'vertex'], extra: ['color', 'uniform', 'constant'], why: 'displayColor + vertex interpolation = one colour per point.' },
      { t: 'mcq', q: 'A cube mesh: 6 faces, 8 points, 24 face-vertices. How many values for <b>uniform</b>?', o: ['1', '6', '8', '24'], a: 1, why: 'uniform = one per face.' },
      { t: 'mcq', q: 'Same cube with <b>faceVarying</b>?', o: ['6', '8', '12', '24'], a: 3, why: 'One per face-corner: 6 faces × 4 corners.' },
      { t: 'tap', q: 'Tap what keeps this attribute from being animated.', code: `⟦uniform⟧ ⟦token⟧ ⟦subdivisionScheme⟧ = ⟦"none"⟧`, a: 0, why: 'uniform = time-invariant.' },
    ]},
  ]
},
// ------------------------------------------------------------ 4
{
  id: 'u4', title: 'LAYERS', sub: 'Stacks, strength, edit targets', emoji: '📚', color: '#ce82ff', shadow: '#a568cc',
  items: [
    { id: 'u4l1', kind: 'lesson', title: 'Sublayers & strength', steps: [
      { t: 'info', h: 'A layer = a file of opinions', p: `A <b>layer</b> is one file (or in-memory document). An <b>opinion</b> is any value authored in it. A stage starts from a <b>root layer</b>, which can pull in others with <b>subLayers</b>:`, lang: 'usda', code: `#usda 1.0\n(\n    subLayers = [\n        @./lighting.usda@,\n        @./anim.usda@,\n        @./layout.usda@\n    ]\n)` },
      { t: 'info', h: 'Who wins?', p: `In the subLayers list the <b>first</b> layer is <b>strongest</b>. The root layer itself beats all of its sublayers, and above everything sits the <b>session layer</b>, a scratch layer for temporary edits that isn't saved with the scene.<br><br><b>session › root › lighting › anim › layout</b>` },
      { t: 'widget', w: 'layerStack', h: 'Layer stack lab', p: 'Reorder and mute layers. Each property shows which layer won.' },
      { t: 'order', q: 'Strongest → weakest.', items: ['session layer', 'root layer', 'first sublayer', 'last sublayer'], why: 'Session on top, then root, then sublayers in list order.' },
      { t: 'mcq', q: 'layout.usda says ball colour = blue. fx.usda says red. Root: subLayers = [@fx.usda@, @layout.usda@]. Result?', o: ['blue', 'red', 'purple', 'error'], a: 1, why: 'fx is listed first, so it\'s stronger.' },
      { t: 'tf', q: 'Opinions merge per property, not per prim.', a: true, why: 'One layer can win radius while another wins colour on the same prim.' },
    ]},
    { id: 'u4l2', kind: 'lesson', title: 'Edit targets & flattening', steps: [
      { t: 'info', h: 'Edit target', p: `When you call <code>attr.Set()</code>, where does the opinion go? Into the stage's <b>edit target</b>, which is the root layer by default.`, lang: 'py', code: `stage.SetEditTarget(stage.GetSessionLayer())\nball.GetAttribute('radius').Set(5)   # goes to session\n\nfx = Sdf.Layer.FindOrOpen('fx.usda')\nstage.SetEditTarget(fx)` },
      { t: 'info', h: 'Muting & flattening', p: `• <b>Mute</b> a layer to ignore it temporarily: <code>stage.MuteLayer(id)</code>.<br>• <b>Flatten</b> bakes the composed result into a single layer with no arcs left: <code>stage.Flatten()</code> or <code>stage.Export('baked.usda')</code>. Great for delivery, bad for collaboration.` },
      { t: 'info', h: 'Layer offsets', p: `A sublayer or reference can be time-shifted and scaled:`, lang: 'usda', code: `subLayers = [\n    @./anim.usda@ (offset = 10; scale = 2)\n]` },
      { t: 'mcq', q: 'Your stage\'s root layer is shot.usda. You call attr.Set(1) without changing anything. Which layer receives the opinion?', o: ['The strongest sublayer', 'The session layer', 'shot.usda (root)', 'A new layer'], a: 2, why: 'By default the edit target is the root layer.' },
      { t: 'mcq', q: 'What does flattening remove?', o: ['Prims', 'Time samples', 'Composition arcs / layer structure', 'Materials'], a: 2, why: 'You get one layer with the final values, with all arcs resolved.' },
    ]},
    { id: 'u4l3', kind: 'lesson', title: 'Layers in Solaris', steps: [
      { t: 'info', h: 'LOPs write layers', p: `In Houdini's <b>Solaris</b> (the <code>/stage</code> context), every LOP node edits a USD stage. Nodes write their opinions into the <b>active layer</b>, and the node graph <i>is</i> your layer stack.` },
      { t: 'match', q: 'Match the LOP to the USD concept.', pairs: [['Sublayer LOP', 'subLayers'], ['Reference LOP', 'references / payloads'], ['Layer Break LOP', 'start a fresh layer'], ['USD ROP', 'write layers to disk']] },
      { t: 'info', h: 'Look under the hood', p: `In the <b>Scene Graph Details</b> pane, choose a layer to see its raw .usda. That's the fastest way to connect what nodes do with what USD stores. Make it a habit!` },
      { t: 'tf', q: 'A Solaris network is ultimately just authoring opinions into USD layers.', a: true, why: 'That\'s why everything you learn here transfers directly into LOPs.' },
    ]},
    { id: 'u4d1', kind: 'drill', title: 'Layer drill', steps: [
      { t: 'order', q: 'subLayers = [@a@, @b@, @c@]. Strongest → weakest (with root).', items: ['root', 'a', 'b', 'c'], why: 'Root beats its sublayers, which go in list order.' },
      { t: 'mcq', q: 'Where do temporary, unsaved viewport tweaks usually go?', o: ['Root layer', 'Session layer', 'Weakest sublayer', 'A payload'], a: 1, why: 'The session layer is the strongest and isn\'t saved with the scene.' },
      { t: 'fill', q: 'Send edits to the fx layer.', lang: 'py', code: `fx = Sdf.Layer.FindOrOpen('fx.usda')\nstage.▢(fx)`, blanks: ['SetEditTarget'], extra: ['SetLayer', 'MuteLayer', 'Flatten'], why: 'stage.SetEditTarget(layer)' },
      { t: 'tf', q: 'If a stronger layer sets radius and a weaker layer sets displayColor, the result has both.', a: true, why: 'Resolution is per property.' },
      { t: 'mcq', q: 'Shift an animation sublayer 10 frames later:', o: ['(offset = 10)', '(scale = 10)', '(start = 10)', '(time = +10)'], a: 0, why: 'Layer offsets: offset and scale.' },
      { t: 'match', q: 'Match.', pairs: [['Mute', 'Ignore a layer temporarily'], ['Flatten', 'Bake to one layer'], ['Edit target', 'Where Set() writes'], ['Session', 'Strongest scratch layer']] },
    ]},
  ]
},
// ------------------------------------------------------------ 5
{
  id: 'u5', title: 'COMPOSITION ARCS', sub: 'References, payloads, variants, LIVERPS', emoji: '🧬', color: '#ff4b4b', shadow: '#d63a3a',
  items: [
    { id: 'u5l1', kind: 'lesson', title: 'References', steps: [
      { t: 'info', h: 'Bring an asset in', p: `A <b>reference</b> grafts a prim hierarchy from another layer onto a prim in yours:`, lang: 'usda', code: `def Xform "Tree_01" (\n    prepend references = @./assets/tree.usda@</Tree>\n)\n{\n    double3 xformOp:translate = (4, 0, 2)\n    uniform token[] xformOpOrder = ["xformOp:translate"]\n}` },
      { t: 'info', h: 'Key facts', p: `• The referenced prim (<code>/Tree</code>) is <b>renamed</b> to the referencing prim (<code>/World/Tree_01</code>), and its children come along.<br>• Leave off <code>&lt;/Tree&gt;</code> and USD uses the file's <b>defaultPrim</b>.<br>• <b>Local opinions</b> on Tree_01 beat anything inside the reference.<br>• Reference the same file 1,000 times and it's loaded once.` },
      { t: 'mcq', q: 'tree.usda has /Tree/Trunk. It\'s referenced onto /World/Oak. Where does Trunk appear?', o: ['/Tree/Trunk', '/World/Oak/Trunk', '/World/Tree/Trunk', '/World/Oak/Tree/Trunk'], a: 1, why: 'The reference target maps onto the referencing prim.' },
      { t: 'tap', q: 'Tap the part that\'s optional if tree.usda has a defaultPrim.', code: `prepend references = ⟦@./tree.usda@⟧⟦</Tree>⟧`, a: 1, why: 'Without a prim path the defaultPrim is used.' },
      { t: 'tf', q: 'A colour authored directly on the referencing prim beats the colour inside the referenced asset.', a: true, why: 'Local opinions (L) are stronger than references (R).' },
    ]},
    { id: 'u5l2', kind: 'lesson', title: 'Payloads', steps: [
      { t: 'info', h: 'References you can unload', p: `A <b>payload</b> works like a reference, but it can be <b>loaded or unloaded</b> on demand. Heavy geometry goes behind payloads so you can open a huge set instantly and only load what you need.`, lang: 'usda', code: `def Xform "City_Block" (\n    prepend payload = @./block_geo.usdc@\n)\n{}` },
      { t: 'widget', w: 'refVsPayload', h: 'Load what you need', p: 'Toggle payloads on and off and watch memory.' },
      { t: 'info', h: 'In Python', lang: 'py', code: `stage = Usd.Stage.Open('city.usda', Usd.Stage.LoadNone)\nstage.Load('/World/City_Block_03')\nstage.Unload('/World/City_Block_03')`, p: 'Open with nothing loaded, then load just one block.' },
      { t: 'mcq', q: 'A prim\'s payload is unloaded. What do you still see?', o: ['Nothing; the prim is gone', 'The prim itself and its local opinions, but not the payload\'s contents', 'Everything, in low res', 'An error'], a: 1, why: 'The prim exists, but the payload\'s contribution isn\'t composed in.' },
      { t: 'tf', q: 'Payloads are stronger than references.', a: false, why: 'LIVERPS: References come before Payloads, so payloads are weaker.' },
    ]},
    { id: 'u5l3', kind: 'lesson', title: 'Variant sets', steps: [
      { t: 'info', h: 'Switchable alternatives', p: `A <b>variantSet</b> holds named <b>variants</b>. Each variant is a bundle of opinions, and the <b>selection</b> picks one.`, lang: 'usda', code: `def Xform "Car" (\n    variants = { string paint = "red" }\n    prepend variantSets = "paint"\n)\n{\n    variantSet "paint" = {\n        "red"  { color3f[] primvars:displayColor = [(0.9,0.1,0.1)] }\n        "blue" { color3f[] primvars:displayColor = [(0.1,0.3,0.9)] }\n    }\n}` },
      { t: 'widget', w: 'variantSwitch', h: 'Switch variants', p: 'Pick a selection in each variant set.' },
      { t: 'info', h: 'The selection is just an opinion', p: `<code>variants = { string paint = "blue" }</code> is an ordinary opinion, so a <b>stronger layer can override the selection</b> with an <code>over</code>. Shots switch asset looks this way without touching the asset file.` },
      { t: 'mcq', q: 'The asset selects paint = "red". The shot layer (stronger) has <code>over "Car" (variants = {string paint = "blue"})</code>. Result?', o: ['red', 'blue', 'Both', 'Error: conflicting selections'], a: 1, why: 'The stronger selection opinion wins.' },
      { t: 'fill', q: 'Author a variant in Python.', lang: 'py', code: `vset = prim.GetVariantSets().AddVariantSet('lod')\nvset.AddVariant('high')\nvset.▢('high')\nwith vset.▢():\n    # opinions here go inside the variant\n    ...`, blanks: ['SetVariantSelection', 'GetVariantEditContext'], extra: ['Select', 'EditVariant', 'GetEditTarget'], why: 'Select the variant, then author inside its edit context.' },
    ]},
    { id: 'u5l4', kind: 'lesson', title: 'Inherits & specializes', steps: [
      { t: 'info', h: 'Inherits: broadcast edits', p: `<b>inherits</b> pulls opinions from another prim, often a <code>class</code>. Change the class once and <b>every</b> inheriting prim updates, even inside referenced assets.`, lang: 'usda', code: `class "_class_Tree" { float leafHue = 0.3 }\n\ndef "Oak_01" (inherits = </_class_Tree>) {}\ndef "Oak_02" (inherits = </_class_Tree>) {}` },
      { t: 'info', h: 'Specializes: weakest base', p: `<b>specializes</b> also pulls from a base prim, but it's the <b>weakest</b> arc. The specialized prim's own refinements <b>always win</b>, even if a stronger layer edits the base.<br><br>A classic use is a material library where <code>BrushedMetal</code> specializes <code>Metal</code>: tweaks to Metal flow through, but BrushedMetal's roughness is kept.` },
      { t: 'mcq', q: 'You want to make every tree in the shot autumnal with one edit, including trees that came in via references. Best arc?', o: ['References', 'Inherits', 'Payloads', 'Specializes'], a: 1, why: 'Inherits broadcast from a class to all inheritors, and they\'re stronger than references.' },
      { t: 'tf', q: 'Specializes is stronger than references.', a: false, why: 'It\'s the S in LIVERPS, the weakest.' },
    ]},
    { id: 'u5l5', kind: 'lesson', title: 'LIVERPS', steps: [
      { t: 'info', h: 'Strength ordering', p: `When arcs disagree, USD walks them in this order, strongest first:<br><br><b class="c1">L</b>ocal (the layer stack)<br><b class="c2">I</b>nherits<br><b class="c3">V</b>ariantSets<br><b class="c4">E</b> r<b>E</b>locates (newer: namespace remapping)<br><b class="c5">R</b>eferences<br><b class="c6">P</b>ayloads<br><b class="c7">S</b>pecializes<br><br>You'll still see "LIVRPS" in older docs. Same thing, before relocates arrived.` },
      { t: 'widget', w: 'liverps', h: 'Turn arcs on & off', p: 'Each arc has an opinion on the colour. Toggle arcs and see who wins.' },
      { t: 'order', q: 'Order the arcs, strongest first.', items: ['Local', 'Inherits', 'VariantSets', 'References', 'Payloads', 'Specializes'], why: 'L-I-V-(E)-R-P-S: "liver peas"' },
      { t: 'info', h: 'List editing', p: `Arcs are <b>list ops</b>:<br><code>prepend</code> adds to the front (stronger)<br><code>append</code> adds to the back (weaker)<br><code>delete</code> removes an entry<br>(no keyword) is an explicit list that replaces weaker opinions<br><br>Prefer <code>prepend</code>, so your arc beats ones from weaker layers.` },
      { t: 'mcq', q: 'A variant sets colour = green. A reference sets colour = red. No local opinion. Result?', o: ['green', 'red', 'neither', 'depends on file order'], a: 0, why: 'V (variants) is stronger than R (references).' },
    ]},
    { id: 'u5d1', kind: 'drill', title: 'Composition drill', steps: [
      { t: 'match', q: 'Match the arc.', pairs: [['Reference', 'Graft another layer\'s prim'], ['Payload', 'Deferred, unloadable reference'], ['Inherits', 'Broadcast from a class'], ['Specializes', 'Weakest base / fallback']] },
      { t: 'mcq', q: 'Which keyword makes your reference strongest among list entries?', o: ['append', 'prepend', 'add', 'delete'], a: 1, why: 'prepend puts it at the front.' },
      { t: 'tf', q: 'A variant selection can be changed by a stronger layer.', a: true, why: 'It\'s just an opinion.' },
      { t: 'mcq', q: 'Inherits says red. Reference says blue. Payload says green. Result?', o: ['red', 'blue', 'green'], a: 0, why: 'I > R > P' },
      { t: 'fill', q: 'Reference the asset\'s default prim.', lang: 'usda', code: `def "Chair_01" (\n    ▢ references = ▢\n)\n{}`, blanks: ['prepend', '@./chair.usda@'], extra: ['append', '</chair.usda>', '"chair.usda"'], why: 'prepend references = @file@' },
      { t: 'mcq', q: 'Open a 10GB set instantly, then load only what the camera sees. Which arc?', o: ['Inherits', 'Payloads', 'Specializes', 'Sublayers'], a: 1, why: 'Payloads are the loadable arc.' },
      { t: 'order', q: 'L-I-V-E-R-P-S: tap the letters\' meaning in order.', items: ['Local', 'Inherits', 'VariantSets', 'rElocates', 'References', 'Payloads', 'Specializes'], why: 'liver peas!' },
    ]},
    { id: 'u5c1', kind: 'challenge', title: 'Composition boss', timed: true, steps: [
      { t: 'mcq', q: 'Local opinion: radius 1. Reference: radius 3. Specializes: radius 5. Result?', o: ['1', '3', '5'], a: 0, why: 'Local is strongest.' },
      { t: 'mcq', q: 'Variant: visible. Inherits: invisible. Result?', o: ['visible', 'invisible'], a: 1, why: 'I beats V.' },
      { t: 'tf', q: 'subLayers create the "L" in LIVERPS: all their opinions count as local.', a: true, why: 'The layer stack (root + sublayers + session) is "Local".' },
      { t: 'mcq', q: 'A referenced asset has <code>Body (specializes = &lt;/Base&gt;)</code>. Your shot edits /Base\'s roughness. Body also sets roughness. Result for Body?', o: ['Your shot edit', 'Body\'s own value', 'Average'], a: 1, why: 'Specializes guarantees the specialized prim\'s refinements win over the base.' },
      { t: 'mcq', q: 'Which arc rewrites namespace (moves prims) instead of merging opinions?', o: ['Relocates', 'Inherits', 'Payloads', 'Variants'], a: 0, why: 'Relocates (the E) remap paths.' },
      { t: 'order', q: 'Strongest → weakest.', items: ['Inherits', 'VariantSets', 'References', 'Specializes'], why: 'I-V-R-S' },
      { t: 'tf', q: 'If you reference the same file 50 times, it is opened 50 times.', a: false, why: 'Layers are shared and cached.' },
      { t: 'mcq', q: 'Prim path inside a reference is omitted. Which prim is used?', o: ['The first prim', 'The defaultPrim', '/World', 'All root prims'], a: 1, why: 'defaultPrim.' },
    ]},
  ]
},
// ------------------------------------------------------------ 6
{
  id: 'u6', title: 'SCALE', sub: 'Instancing, point instancers, loading', emoji: '🌲', color: '#2bd9c4', shadow: '#1fb3a1',
  items: [
    { id: 'u6l1', kind: 'lesson', title: 'Native instancing', steps: [
      { t: 'info', h: 'instanceable = true', p: `Mark prims whose composition arcs are <b>identical</b> as <b>instanceable</b>. USD then builds one shared <b>prototype</b>, and every instance points at it.`, lang: 'usda', code: `def "Tree_001" (\n    instanceable = true\n    prepend references = @./tree.usda@\n) { double3 xformOp:translate = (3,0,1) … }` },
      { t: 'widget', w: 'instancing', h: 'A forest', p: 'Toggle instancing and watch memory. Then try editing a leaf.' },
      { t: 'info', h: 'The catch', p: `Descendants of an instance are <b>instance proxies</b>, and they're <b>read-only</b>. You can still edit the <b>instance prim itself</b> (transform, visibility, inherited primvars, variant selections). Changing a variant selection gives that instance a different prototype.` },
      { t: 'tf', q: 'You can author a new colour on /Forest/Tree_007/Leaves when Tree_007 is instanceable.', a: false, why: 'Leaves is an instance proxy, so it\'s read-only. De-instance or edit the class/asset instead.' },
      { t: 'mcq', q: '1,000 instanceable trees use 2 different variant selections. Roughly how many prototypes?', o: ['1', '2', '1,000', '0'], a: 1, why: 'Instances with identical composition share a prototype, and two selections means two.' },
    ]},
    { id: 'u6l2', kind: 'lesson', title: 'PointInstancer', steps: [
      { t: 'info', h: 'Millions of things', p: `<b>UsdGeom.PointInstancer</b> stamps <b>prototypes</b> using arrays, with no prim per copy. It's ideal for grass, rocks and debris from a Houdini scatter.`, lang: 'usda', code: `def PointInstancer "Rocks" {\n    rel prototypes = [</Rocks/Protos/A>, </Rocks/Protos/B>]\n    int[] protoIndices = [0, 1, 1, 0, …]\n    point3f[] positions = [(0,0,0), (2,0,1), …]\n    quath[] orientations = [ … ]\n    float3[] scales = [ … ]\n}` },
      { t: 'match', q: 'Match the PointInstancer attribute.', pairs: [['prototypes', 'rel to source prims'], ['protoIndices', 'which prototype per point'], ['positions', 'where'], ['orientations', 'rotation (quats)']] },
      { t: 'mcq', q: 'Native instances vs point instances: which gives each copy its <b>own prim</b> you can select?', o: ['Native instancing', 'PointInstancer', 'Both', 'Neither'], a: 0, why: 'Native instances are real prims. Point instances are just array entries.' },
      { t: 'tf', q: 'protoIndices = [1,1,0] places prototype B at the first two points.', a: true, why: 'Index 1 = second prototype in the rel.' },
    ]},
    { id: 'u6d1', kind: 'drill', title: 'Scale drill', steps: [
      { t: 'mcq', q: 'Read-only prims under an instance are called…', o: ['Prototypes', 'Instance proxies', 'Overs', 'Payloads'], a: 1, why: 'Instance proxies.' },
      { t: 'mcq', q: 'Best for 5 million grass blades from a scatter?', o: ['5M referenced prims', 'Native instancing', 'PointInstancer', 'Variants'], a: 2, why: 'Arrays scale to millions; prims don\'t.' },
      { t: 'tf', q: 'Payloads + Stage.LoadNone let you open a huge stage without loading heavy data.', a: true, why: 'Then load selectively.' },
      { t: 'fill', q: 'Make it instanceable.', lang: 'usda', code: `def "Rock_12" (\n    ▢ = true\n    prepend references = @./rock.usd@\n) {}`, blanks: ['instanceable'], extra: ['instance', 'prototype', 'shared'], why: 'instanceable = true' },
      { t: 'mcq', q: 'Which edit is allowed on an instance prim?', o: ['Change a mesh point under it', 'Move the instance prim itself', 'Rename a child', 'Add a child'], a: 1, why: 'The instance root is a normal prim. Its descendants are proxies.' },
    ]},
  ]
},
// ------------------------------------------------------------ 7
{
  id: 'u7', title: 'MATERIALS', sub: 'UsdShade, PreviewSurface, binding', emoji: '🎨', color: '#ff86d0', shadow: '#d96bae',
  items: [
    { id: 'u7l1', kind: 'lesson', title: 'Materials & shaders', steps: [
      { t: 'info', h: 'A network of prims', p: `A <b>Material</b> prim contains <b>Shader</b> prims. Shader <b>inputs</b> are connected to <b>outputs</b> with <code>.connect</code>:`, lang: 'usda', code: `def Material "Red" {\n    token outputs:surface.connect = </Mats/Red/PBR.outputs:surface>\n    def Shader "PBR" {\n        uniform token info:id = "UsdPreviewSurface"\n        color3f inputs:diffuseColor = (0.9, 0.1, 0.1)\n        float inputs:roughness = 0.4\n        float inputs:metallic = 0\n        token outputs:surface\n    }\n}` },
      { t: 'info', h: 'UsdPreviewSurface', p: `The portable, "works everywhere" shader. Main inputs:<br><code>diffuseColor roughness metallic opacity emissiveColor normal</code><br><br>Textures come from <b>UsdUVTexture</b> (<code>inputs:file = @rust.png@</code> → <code>outputs:rgb</code>), with UVs supplied by <b>UsdPrimvarReader_float2</b> reading <code>st</code>.` },
      { t: 'tap', q: 'Tap what identifies the shader type.', code: `def Shader "PBR" {\n    uniform token ⟦info:id⟧ = "UsdPreviewSurface"\n    color3f ⟦inputs:diffuseColor⟧ = (1,1,1)\n    token ⟦outputs:surface⟧\n}`, a: 0, why: 'info:id names the shader node definition.' },
      { t: 'order', q: 'Order a texture network, data flowing left → right.', items: ['UsdPrimvarReader_float2 (st)', 'UsdUVTexture', 'UsdPreviewSurface', 'Material outputs:surface'], why: 'UVs → texture lookup → surface → material output' },
      { t: 'mcq', q: 'Renderer-specific outputs (e.g. MaterialX for Karma) use…', o: ['A separate material', 'A render-context output like outputs:mtlx:surface', 'A variant', 'A payload'], a: 1, why: 'One Material can carry several render-context outputs.' },
    ]},
    { id: 'u7l2', kind: 'lesson', title: 'Binding', steps: [
      { t: 'info', h: 'material:binding', p: `Apply <b>MaterialBindingAPI</b> and point the relationship at a material:`, lang: 'usda', code: `def Mesh "Body" (\n    prepend apiSchemas = ["MaterialBindingAPI"]\n)\n{\n    rel material:binding = </Mats/Red>\n}` },
      { t: 'widget', w: 'materialBind', h: 'Binding inheritance', p: 'Bind materials on the parent or children and see what each mesh resolves to.' },
      { t: 'info', h: 'Rules', p: `• Bindings are <b>inherited</b>: a mesh with no binding uses its nearest bound ancestor.<br>• The <b>child's own binding wins</b>… unless the ancestor's binding is marked <code>bindMaterialAs = "strongerThanDescendants"</code>.<br>• Purpose-specific bindings exist: <code>material:binding:preview</code>, <code>material:binding:full</code>.<br>• <b>Collection</b>-based bindings bind many prims at once.` },
      { t: 'mcq', q: '/Car is bound to Red. /Car/Wheel is bound to Rubber. What does Wheel get?', o: ['Red', 'Rubber', 'Nothing', 'Both'], a: 1, why: 'The descendant\'s own binding wins by default.' },
      { t: 'mcq', q: 'Same, but /Car\'s binding has bindMaterialAs = "strongerThanDescendants". Wheel?', o: ['Red', 'Rubber'], a: 0, why: 'strongerThanDescendants flips the rule.' },
    ]},
    { id: 'u7d1', kind: 'drill', title: 'Shading drill', steps: [
      { t: 'fill', q: 'Wire up the surface.', lang: 'usda', code: `def Material "Gold" {\n    token outputs:surface.▢ = </Mats/Gold/PBR.outputs:surface>\n    def Shader "PBR" {\n        uniform token info:id = "▢"\n    }\n}`, blanks: ['connect', 'UsdPreviewSurface'], extra: ['link', 'Principled', 'bind'], why: '.connect + UsdPreviewSurface' },
      { t: 'match', q: 'Match the shader.', pairs: [['UsdPreviewSurface', 'The surface BSDF'], ['UsdUVTexture', 'Reads an image file'], ['UsdPrimvarReader_float2', 'Reads UVs (st)']] },
      { t: 'tf', q: 'A mesh with no binding of its own can inherit one from a parent prim.', a: true, why: 'Bindings inherit down namespace.' },
      { t: 'mcq', q: 'Which relationship name binds a material?', o: ['material:assign', 'material:binding', 'shader:target', 'surface:mat'], a: 1, why: 'rel material:binding' },
      { t: 'mcq', q: 'Which PreviewSurface input makes something glow?', o: ['diffuseColor', 'emissiveColor', 'opacity', 'clearcoat'], a: 1, why: 'emissiveColor.' },
    ]},
  ]
},
// ------------------------------------------------------------ 8
{
  id: 'u8', title: 'PYTHON API', sub: 'pxr: Usd, UsdGeom, Sdf, Gf', emoji: '🐍', color: '#ff9600', shadow: '#d97f00',
  items: [
    { id: 'u8l1', kind: 'lesson', title: 'Create a stage', steps: [
      { t: 'info', h: 'Hello, USD', lang: 'py', code: `from pxr import Usd, UsdGeom, Gf\n\nstage = Usd.Stage.CreateNew('hello.usda')\nworld = UsdGeom.Xform.Define(stage, '/World')\nball = UsdGeom.Sphere.Define(stage, '/World/Ball')\nball.GetRadiusAttr().Set(2.0)\nUsdGeom.XformCommonAPI(ball).SetTranslate(Gf.Vec3d(0, 2, 0))\nstage.SetDefaultPrim(world.GetPrim())\nstage.Save()`, p: '<b>Define</b> creates a "def" prim of that type and returns a schema object with typed getters like GetRadiusAttr().' },
      { t: 'order', q: 'Put the script in order.', items: ['from pxr import Usd, UsdGeom', "stage = Usd.Stage.CreateNew('a.usda')", "UsdGeom.Cube.Define(stage, '/World/Box')", 'stage.Save()'], why: 'import → create → define → save' },
      { t: 'match', q: 'Match the module.', pairs: [['Usd', 'Stages & prims'], ['UsdGeom', 'Geometry schemas'], ['Sdf', 'Layers & paths'], ['Gf', 'Vectors & matrices']] },
      { t: 'mcq', q: 'Schema object → raw prim?', o: ['ball.prim', 'ball.GetPrim()', 'Usd.Prim(ball)', 'ball.AsPrim()'], a: 1, why: 'Every schema object has GetPrim().' },
    ]},
    { id: 'u8l2', kind: 'lesson', title: 'Read & traverse', steps: [
      { t: 'info', h: 'Query a stage', lang: 'py', code: `stage = Usd.Stage.Open('shot.usda')\nfor prim in stage.Traverse():\n    print(prim.GetPath(), prim.GetTypeName())\n\nball = stage.GetPrimAtPath('/World/Ball')\nif ball.IsValid():\n    r = ball.GetAttribute('radius').Get()\n    r24 = ball.GetAttribute('radius').Get(24)  # at frame 24`, p: '<b>Traverse()</b> walks every defined, active, loaded prim, depth-first.' },
      { t: 'fill', q: 'Print every Mesh path.', lang: 'py', code: `for prim in stage.▢():\n    if prim.▢(UsdGeom.Mesh):\n        print(prim.GetPath())`, blanks: ['Traverse', 'IsA'], extra: ['Walk', 'IsType', 'Children'], why: 'stage.Traverse() walks the stage. prim.IsA(UsdGeom.Mesh) checks the type, subclasses included.' },
      { t: 'info', h: 'World transforms', lang: 'py', code: `xf = UsdGeom.Xformable(prim)\nm = xf.ComputeLocalToWorldTransform(Usd.TimeCode.Default())\nprint(m.ExtractTranslation())`, p: 'For many prims, a <b>UsdGeom.XformCache</b> is faster.' },
      { t: 'mcq', q: 'GetPrimAtPath on a path that doesn\'t exist returns…', o: ['None', 'An invalid prim (IsValid() == False)', 'Raises KeyError', 'Creates it'], a: 1, why: 'Always check prim.IsValid() (or just "if prim:").' },
    ]},
    { id: 'u8l3', kind: 'lesson', title: 'Composition in code', steps: [
      { t: 'info', h: 'Arcs from Python', lang: 'py', code: `tree = stage.DefinePrim('/World/Tree_01')\ntree.GetReferences().AddReference('./tree.usda')\nblock = stage.DefinePrim('/World/Block')\nblock.GetPayloads().AddPayload('./block.usdc')\ntree.GetInherits().AddInherit('/_class_Tree')\ntree.SetInstanceable(True)`, p: 'Each arc type has a Get…() list editor with Add/Remove/Clear.' },
      { t: 'info', h: 'Working with layers directly', lang: 'py', code: `from pxr import Sdf\nlayer = Sdf.Layer.CreateNew('lighting.usda')\nroot = stage.GetRootLayer()\nroot.subLayerPaths.insert(0, layer.identifier)  # strongest\nstage.SetEditTarget(layer)`, p: '<b>Sdf</b> works at the raw layer level, below composition.' },
      { t: 'fill', q: 'Add a payload.', lang: 'py', code: `prim.▢().▢('./heavy.usdc')`, blanks: ['GetPayloads', 'AddPayload'], extra: ['GetReferences', 'AddReference', 'Load'], why: 'GetPayloads().AddPayload(path)' },
      { t: 'mcq', q: 'To make a new sublayer the strongest, you…', o: ["subLayerPaths.append(id)", 'subLayerPaths.insert(0, id)', 'subLayerPaths[-1] = id', 'SetEditTarget(id)'], a: 1, why: 'The first entry is strongest.' },
    ]},
    { id: 'u8d1', kind: 'drill', title: 'Python drill', steps: [
      { t: 'fill', q: 'Create a sphere.', lang: 'py', code: `s = UsdGeom.Sphere.▢(stage, '/World/S')\ns.▢().Set(3)`, blanks: ['Define', 'GetRadiusAttr'], extra: ['Create', 'Apply', 'GetSizeAttr'], why: 'Typed schemas: Define. Sphere: GetRadiusAttr.' },
      { t: 'mcq', q: 'Open a stage with all payloads unloaded:', o: ["Usd.Stage.Open(p, Usd.Stage.LoadNone)", "Usd.Stage.Open(p, load=False)", "Usd.Stage.OpenLight(p)", "Sdf.Layer.Open(p)"], a: 0, why: 'InitialLoadSet LoadNone.' },
      { t: 'order', q: 'Author into a variant.', items: ["vset = prim.GetVariantSets().AddVariantSet('look')", "vset.AddVariant('dirty')", "vset.SetVariantSelection('dirty')", 'with vset.GetVariantEditContext():'], why: 'add set → add variant → select → edit context' },
      { t: 'mcq', q: 'Value of attr at frame 12?', o: ['attr.Get(12)', 'attr.GetAt(12)', 'attr.Get(time=12f)', 'attr[12]'], a: 0, why: 'Get(Usd.TimeCode(12)), or just Get(12).' },
      { t: 'match', q: 'Match the call.', pairs: [['Define', 'Typed schema → def prim'], ['Apply', 'Add an API schema'], ['DefinePrim', 'Untyped/any def prim'], ['OverridePrim', 'Author an over']] },
      { t: 'tf', q: 'stage.Traverse() visits prims under unloaded payloads.', a: false, why: 'Unloaded payload contents aren\'t composed, so there\'s nothing to visit.' },
    ]},
  ]
},
// ------------------------------------------------------------ 9
{
  id: 'u9', title: 'PIPELINE & SOLARIS', sub: 'Asset structure, shots, tools', emoji: '🏗️', color: '#7c6cff', shadow: '#5f50d9',
  items: [
    { id: 'u9l1', kind: 'lesson', title: 'Asset structure', steps: [
      { t: 'info', h: 'A well-built component', p: `A common layout (and what Houdini's <b>Component Builder</b> writes out):<br><br><code>chair.usd</code>: the interface. defaultPrim <code>/chair</code>, kind = component, variants, payload ↓<br><code>payload.usdc</code>: sublayers ↓<br>&nbsp;&nbsp;<code>geo.usdc</code>: geometry (proxy + render purposes)<br>&nbsp;&nbsp;<code>mtl.usdc</code>: materials + bindings` },
      { t: 'info', h: 'Why so many files?', p: `• Opening a set reads only the small <b>interface</b> files. Geometry stays unloaded behind the <b>payload</b>.<br>• Modelling and lookdev write <b>separate layers</b>, so they never fight.<br>• Variants live on the interface prim, so shots can switch them while the payload is still unloaded.` },
      { t: 'order', q: 'Houdini Component Builder nodes, top to bottom.', items: ['Component Geometry', 'Material Library', 'Component Material', 'Component Output'], why: 'geometry → materials → assign → write files' },
      { t: 'mcq', q: 'Asset paths like @./tex/wood.png@ are resolved relative to…', o: ['The current working directory', 'The layer that authored them', 'The stage\'s root layer', '$HIP'], a: 1, why: 'Relative asset paths are anchored to the layer they\'re written in.' },
    ]},
    { id: 'u9l2', kind: 'lesson', title: 'Shot structure', steps: [
      { t: 'info', h: 'Department layers', p: `A shot's root layer typically sublayers department layers. <b>Downstream</b> departments sit <b>stronger</b> so they can override upstream work:`, lang: 'usda', code: `#usda 1.0\n(\n    subLayers = [\n        @./sh010_lighting.usda@,\n        @./sh010_fx.usda@,\n        @./sh010_anim.usda@,\n        @./sh010_layout.usda@,\n        @../seq/set_dressing.usda@\n    ]\n)` },
      { t: 'order', q: 'Strongest → weakest for a typical shot.', items: ['lighting', 'fx', 'anim', 'layout', 'set dressing'], why: 'Later departments override earlier ones.' },
      { t: 'tf', q: 'Lighting should use "over" when tweaking prims that layout defined.', a: true, why: 'over adds opinions without (re)defining the prim.' },
    ]},
    { id: 'u9l3', kind: 'lesson', title: 'Command-line tools', steps: [
      { t: 'info', h: 'The toolbox', p: `Shipped with USD builds (and Houdini's <code>$HFS/bin</code>):<br><br><b>usdview</b>: inspect stages visually<br><b>usdcat</b>: print/convert, <code>--flatten</code> to bake<br><b>usdtree</b>: print the prim hierarchy<br><b>usdchecker</b>: validate compliance, e.g. for usdz<br><b>usdzip</b>: build .usdz packages<br><b>usdresolve</b>: see where an asset path resolves<br><b>usddiff</b>: compare two files<br><b>usdrecord</b>: render images through Hydra` },
      { t: 'match', q: 'Match the tool to the job.', pairs: [['usdcat', 'Convert .usdc → .usda'], ['usdzip', 'Package for AR'], ['usdchecker', 'Validate an asset'], ['usdview', 'Inspect visually']] },
      { t: 'mcq', q: 'Bake a whole composed shot into one file:', o: ['usdzip shot.usda', 'usdcat --flatten shot.usda -o baked.usda', 'usdtree shot.usda', 'usdresolve shot.usda'], a: 1, why: 'usdcat --flatten' },
    ]},
    { id: 'u9c1', kind: 'challenge', title: 'Final boss', timed: true, steps: [
      { t: 'mcq', q: 'Which file extension is a zip package?', o: ['.usda', '.usdc', '.usdz'], a: 2, why: '.usdz' },
      { t: 'order', q: 'LIVERPS without the E.', items: ['Local', 'Inherits', 'VariantSets', 'References', 'Payloads', 'Specializes'], why: 'LIVRPS' },
      { t: 'mcq', q: 'Container for lights that never moves:', o: ['Xform', 'Scope'], a: 1, why: 'Scope.' },
      { t: 'mcq', q: 'xformOpOrder [translate, rotate, scale]: first op applied to points?', o: ['translate', 'rotate', 'scale'], a: 2, why: 'Right to left.' },
      { t: 'tf', q: 'Time samples in a weaker layer beat a default in a stronger layer.', a: false, why: 'Strongest layer with any value wins.' },
      { t: 'mcq', q: 'Per-face-corner UVs need interpolation…', o: ['vertex', 'uniform', 'faceVarying'], a: 2, why: 'faceVarying.' },
      { t: 'mcq', q: 'Read-only descendants of an instanceable prim are…', o: ['prototypes', 'instance proxies', 'classes'], a: 1, why: 'instance proxies.' },
      { t: 'fill', q: 'Bind it.', lang: 'usda', code: `▢ material:binding = </Mats/Steel>`, blanks: ['rel'], extra: ['def', 'token', 'asset'], why: 'Relationships use rel.' },
      { t: 'mcq', q: 'Which arc lets a shot switch an asset from "clean" to "dirty"?', o: ['Payload', 'VariantSet selection', 'Specializes', 'Sublayer'], a: 1, why: 'Override the variant selection.' },
      { t: 'mcq', q: 'Create a typed prim in Python:', o: ['UsdGeom.Mesh.Define(stage, path)', 'UsdGeom.Mesh.Apply(prim)', 'stage.Mesh(path)'], a: 0, why: 'Define.' },
    ]},
  ]
},
];

// ------------------------------------------------------------ GLOSSARY
const GLOSSARY = [
  ['Stage', 'The composed scene you query: all layers and arcs resolved together.'],
  ['Layer', 'A file (or in-memory doc) of opinions. .usda / .usdc / anonymous.'],
  ['Opinion', 'Any value or metadata authored in a layer. The strongest opinion wins.'],
  ['Prim', 'A node in the scene namespace. Has a specifier, type, name, properties.'],
  ['Attribute', 'A typed, optionally time-sampled value on a prim.'],
  ['Relationship', 'A property that targets other paths (e.g. material:binding).'],
  ['Path', 'Address in namespace: /World/Ball, or /World/Ball.radius for a property.'],
  ['Specifier', 'def (defines), over (overrides only), class (abstract base).'],
  ['Schema', 'Typed (IsA) gives a prim its type. API schemas are applied mix-ins.'],
  ['Kind', 'Model hierarchy metadata: assembly › group › component › subcomponent.'],
  ['Purpose', 'default / render / proxy / guide: when a prim is drawn.'],
  ['xformOpOrder', 'Ordered list of xform ops. The last op is applied to points first.'],
  ['Time sample', 'A value at a specific time code. Linear interpolation by default.'],
  ['Primvar', 'A surface-varying attribute for shaders. Interpolation: constant/uniform/varying/vertex/faceVarying.'],
  ['Sublayer', 'Layer stack composition. Earlier in the list = stronger. Forms "Local".'],
  ['Session layer', 'Strongest layer in the stack, unsaved scratch edits.'],
  ['Edit target', 'Which layer Set() writes to. The root layer by default.'],
  ['Reference', 'Grafts a prim from another layer under a prim. R in LIVERPS.'],
  ['Payload', 'A loadable/unloadable reference. P in LIVERPS.'],
  ['VariantSet', 'Named switchable groups of opinions. The selection is itself an opinion.'],
  ['Inherits', 'Pull opinions from a (usually class) prim. Edits broadcast to inheritors.'],
  ['Specializes', 'Weakest arc. A base the specialized prim always refines.'],
  ['Relocates', 'Namespace remapping arc (the E in LIVERPS).'],
  ['LIVERPS', 'Local, Inherits, Variants, rElocates, References, Payloads, Specializes.'],
  ['List op', 'prepend / append / delete / explicit edits to lists like references.'],
  ['defaultPrim', 'Layer metadata: the prim used when a reference gives no prim path.'],
  ['Instanceable', 'Prims with identical arcs share one prototype; descendants are read-only proxies.'],
  ['PointInstancer', 'Array-driven instancing: prototypes + protoIndices + positions…'],
  ['Material binding', 'rel material:binding (+ MaterialBindingAPI). Inherited down namespace.'],
  ['UsdPreviewSurface', 'The portable standard surface shader.'],
  ['Flatten', 'Bake a composed stage into one layer with no arcs.'],
  ['Asset resolver (Ar)', 'Turns @asset paths@ into real file locations.'],
  ['Hydra', 'USD\'s rendering framework. Render delegates like Karma or Storm plug into it.'],
  ['Solaris / LOPs', 'Houdini\'s USD context. Each LOP authors opinions into layers.'],
];
