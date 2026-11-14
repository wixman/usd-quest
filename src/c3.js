// ============================================================
//  PART 3: SCENE DOMAINS
// ============================================================

// ------------------------------------------------------------ U12
UNITS.push({
  id: 'u12', part: 'p3', title: 'GEOMETRY', sub: 'Transforms, meshes, gprims', emoji: '📐', color: '#1cb0f6', shadow: '#1899d6',
  items: [
    { id: 'u12l1', kind: 'lesson', title: 'The UsdGeom family', steps: [
      { t: 'info', h: 'A family tree', p: `Geometry schemas live in <b>UsdGeom</b> and build on each other:<br><br><b>Imageable</b>: can be drawn. Has <code>visibility</code> and <code>purpose</code>.<br>└ <b>Xformable</b>: can be transformed. Xform, Camera, lights…<br>&nbsp;&nbsp;└ <b>Boundable</b>: has an <code>extent</code> (a local bounding box).<br>&nbsp;&nbsp;&nbsp;&nbsp;└ <b>Gprim</b>: actual geometry, drawn by renderers.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mesh, Points, BasisCurves, NurbsCurves, NurbsPatch, Sphere, Cube, Cone, Cylinder, Capsule, Plane<br><br>Plus <b>Scope</b> (an Imageable that isn't Xformable) and <b>PointInstancer</b>.` },
      { t: 'info', h: 'Gprim rules', p: `• Gprims <b>must not be nested</b> under other gprims. Group them under Xforms instead.<br>• Gprims should author an <code>extent</code> (renderers and culling use it). For animated meshes, the extent should be animated too.<br>• Don't instance a gprim directly. Instance a parent Xform.<br><br>Sphere, Cube, Cone, Cylinder and Capsule are <b>intrinsic</b> shapes: perfect maths, also handy as colliders.` },
      { t: 'tf', q: 'It\'s fine to put a Sphere prim as a child of a Mesh prim.', a: false, why: 'Gprims must not nest under other gprims. Use an Xform as the parent.' },
      { t: 'mcq', q: 'Which schema adds the <code>extent</code> attribute?', o: ['Imageable', 'Xformable', 'Boundable', 'Scope'], a: 2, why: 'Boundable introduces extent, a cached local-space bounding box.' },
      { t: 'info', h: 'Coordinate system', p: `UsdGeom is <b>right-handed</b>. Cameras look down <b>−Z</b> with +Y up.<br><br>The stage declares its conventions in <b>layer metadata</b>:<br>• <code>upAxis = "Y"</code> or <code>"Z"</code> (Houdini and Maya default to Y; some CAD and game tools use Z)<br>• <code>metersPerUnit = 0.01</code> (cm) or <code>1.0</code> (m)<br><br>USD doesn't automatically convert when you mix them. Tools are expected to notice and correct.` },
      { t: 'mcq', q: 'A file says <code>metersPerUnit = 1</code> and you reference it into a cm scene (0.01). What happens automatically?', o: ['USD scales it ×100', 'Nothing; you must correct it yourself', 'It errors', 'It converts upAxis'], a: 1, why: 'Units are metadata. Conversion is up to your tools or pipeline.' },
      { t: 'info', h: 'Key takeaways', p: `• Imageable › Xformable › Boundable › Gprim<br>• Don't nest gprims. Author extents. Instance Xforms, not gprims<br>• Right-handed, with <code>upAxis</code> and <code>metersPerUnit</code> in layer metadata` },
    ]},
    { id: 'u12l2', kind: 'lesson', title: 'Transforms', steps: [
      { t: 'info', h: 'xformOps', p: `Xformable prims build their local matrix from a list of <b>xform ops</b>. Each op is its own attribute, and <code>xformOpOrder</code> says which ones to use, in what order:`, lang: 'usda', code: `double3 xformOp:translate = (0, 5, 0)\nfloat3 xformOp:rotateXYZ = (0, 45, 0)\nfloat3 xformOp:scale = (2, 2, 2)\nuniform token[] xformOpOrder = [\n    "xformOp:translate", "xformOp:rotateXYZ", "xformOp:scale"\n]`, after: 'Because each op is a separate attribute, a stronger layer can override just the rotation and leave translate alone.' },
      { t: 'info', h: 'Read it right to left', p: `Points are transformed by the op at the <b>end</b> of the list first. With <code>[translate, rotate, scale]</code> the object is <b>scaled</b>, then <b>rotated</b>, then <b>translated</b>: the classic TRS you want 99% of the time.<br><br>Op types: <code>translate</code>, <code>scale</code>, <code>rotateX/Y/Z</code>, <code>rotateXYZ</code> (and the other 5 orders), <code>orient</code> (quaternion), <code>transform</code> (a full matrix4d). Angles are in <b>degrees</b>.` },
      { t: 'widget', w: 'xformOrder', h: 'Order matters', p: 'Reorder the ops and watch the box. Try putting translate last.' },
      { t: 'mcq', q: 'With xformOpOrder = [translate, rotateXYZ, scale], which op is applied to the points <b>first</b>?', o: ['translate', 'rotateXYZ', 'scale', 'They\'re simultaneous'], a: 2, why: 'The list reads outer → inner, so the last op touches the points first.' },
      { t: 'tf', q: 'Authoring xformOp:translate without listing it in xformOpOrder still moves the prim.', a: false, why: 'Only ops listed in xformOpOrder are used.' },
      { t: 'info', h: 'Inheritance & reset', p: `Transforms are <b>hierarchical</b>: a child's world matrix is its local matrix times its parent's world matrix.<br><br>Put <code>"!resetXformStack!"</code> first in a child's xformOpOrder to <b>ignore all parent transforms</b>. The child's ops then become its world transform.` },
      { t: 'info', h: 'Easy mode in Python', lang: 'py', code: `api = UsdGeom.XformCommonAPI(prim)\napi.SetTranslate((0, 5, 0))\napi.SetRotate((0, 45, 0))\napi.SetScale((2, 2, 2))\n\nxf = UsdGeom.Xformable(prim)\nworld = xf.ComputeLocalToWorldTransform(Usd.TimeCode.Default())`, p: '<b>XformCommonAPI</b> writes standard ops in a standard order for you.' },
      { t: 'info', h: 'Key takeaways', p: `• Each xform op is an attribute. <code>xformOpOrder</code> picks and orders them<br>• The last op is applied first, so [T, R, S] means scale → rotate → translate<br>• Transforms inherit down the tree. <code>!resetXformStack!</code> breaks that` },
    ]},
    { id: 'u12l3', kind: 'lesson', title: 'Meshes', steps: [
      { t: 'info', h: 'Mesh topology', p: `A <b>Mesh</b> is a list of points plus a description of faces:`, lang: 'usda', code: `def Mesh "Quad" {\n    point3f[] points = [(0,0,0), (1,0,0), (1,1,0), (0,1,0)]\n    int[] faceVertexCounts = [4]          # one face with 4 corners\n    int[] faceVertexIndices = [0, 1, 2, 3]  # which points make it\n    float3[] extent = [(0,0,0), (1,1,0)]\n}`, after: `• <code>faceVertexCounts</code>: how many corners each face has<br>• <code>faceVertexIndices</code>: the point index of each corner, face by face<br>• a <b>face-vertex</b> = one corner of one face (here there are 4)` },
      { t: 'mcq', q: 'A cube mesh has 6 quad faces. How many entries in faceVertexIndices?', o: ['6', '8', '24', '12'], a: 2, why: '6 faces × 4 corners = 24 face-vertices.' },
      { t: 'info', h: 'Subdivision is ON by default', p: `<code>uniform token subdivisionScheme</code> falls back to <b><code>catmullClark</code></b>. Unless you set <code>"none"</code>, renderers treat a USD mesh as a <b>subdivision surface</b>.<br><br>Other values: <code>loop</code>, <code>bilinear</code>. Related attributes: <code>creaseIndices/Sharpnesses</code>, <code>cornerIndices/Sharpnesses</code>, <code>holeIndices</code>, <code>interpolateBoundary</code>.<div class="warn">⚠️ Authored <code>normals</code> are ignored on subdivided meshes. Set <code>subdivisionScheme = "none"</code> for hard-surface models that rely on custom normals.</div>` },
      { t: 'tf', q: 'A USD mesh with no subdivisionScheme authored renders as a plain polygon mesh.', a: false, why: 'The fallback is catmullClark, so it subdivides.' },
      { t: 'info', h: 'Orientation & winding', p: `By default a face's front side follows the <b>right-hand rule</b> on its vertex order (counter-clockwise). <code>orientation = "leftHanded"</code> flips it. <code>doubleSided</code> says whether back faces render.<div class="hou">🟠 <b>Houdini:</b> Houdini's polygon winding is left-handed, so SOP Import reverses vertex order on import for you.</div>` },
      { t: 'info', h: 'GeomSubsets', p: `A <b>GeomSubset</b> is a child prim of a mesh that names a <b>subset of its faces</b> (indices + <code>elementType = "face"</code>). Its main use is assigning <b>different materials to different faces</b> of one mesh (<code>familyName = "materialBind"</code>).<div class="hou">🟠 <b>Houdini:</b> SOP primitive groups become GeomSubsets via the Subset Groups parameter.</div>` },
      { t: 'mcq', q: 'One mesh needs rubber on some faces and chrome on others. Best tool?', o: ['Two variants', 'GeomSubsets with material bindings', 'Two payloads', 'Purpose'], a: 1, why: 'GeomSubsets partition faces so each subset can have its own binding.' },
      { t: 'info', h: 'Key takeaways', p: `• points + faceVertexCounts + faceVertexIndices = topology<br>• <b>catmullClark</b> by default, and normals are ignored when subdivided<br>• <b>GeomSubsets</b> split faces, for example for per-face materials` },
    ]},
    { id: 'u12l4', kind: 'lesson', title: 'Curves, points & motion', steps: [
      { t: 'info', h: 'Other point-based gprims', p: `<b>Points</b>: particles, with <code>widths</code> for size.<br><b>BasisCurves</b>: hair, fur and grass. <code>type</code> is <code>linear</code> or <code>cubic</code>, <code>basis</code> is <code>bezier</code>, <code>bspline</code> or <code>catmullRom</code>, plus <code>curveVertexCounts</code> and <code>widths</code>.<br><b>NurbsCurves</b>, <b>NurbsPatch</b>, <b>HermiteCurves</b>, <b>TetMesh</b> for more specialised cases.` },
      { t: 'info', h: 'Motion blur data', p: `Point-based prims can carry <code>velocities</code> (and <code>accelerations</code>) so renderers can compute motion blur <b>between</b> samples. This is essential when <b>topology changes every frame</b> (fluids, particles), because there's no matching point to interpolate to.<div class="hou">🟠 <b>Houdini:</b> SOP <code>v</code> → <code>velocities</code>, <code>accel</code> → <code>accelerations</code>, <code>pscale</code>/<code>width</code> → <code>widths</code>.</div>` },
      { t: 'mcq', q: 'A FLIP fluid mesh changes point count every frame. What gives it correct motion blur?', o: ['More time samples', 'A velocities attribute', 'subdivisionScheme', 'extent'], a: 1, why: 'With changing topology you can\'t interpolate between frames, so velocities provide the motion.' },
      { t: 'match', q: 'Match the gprim.', pairs: [['Points', 'Particles'], ['BasisCurves', 'Hair / grass'], ['Mesh', 'Polygons & subdivs'], ['Capsule', 'Intrinsic shape']] },
      { t: 'info', h: 'Key takeaways', p: `• Points and BasisCurves cover particles, hair and grass<br>• <code>velocities</code>/<code>accelerations</code> give motion blur, essential for changing topology` },
    ]},
    { id: 'u12d1', kind: 'drill', title: 'Geometry drill', steps: [
      { t: 'order', q: 'Build a standard xformOpOrder.', items: ['xformOp:translate', 'xformOp:rotateXYZ', 'xformOp:scale'], why: 'T·R·S. Points get scaled first.' },
      { t: 'mcq', q: 'A child should ignore all its parents\' transforms. What goes first in its xformOpOrder?', o: ['!invert!', '!resetXformStack!', 'xformOp:reset', 'world'], a: 1, why: '!resetXformStack!' },
      { t: 'tf', q: 'UsdGeom is a right-handed coordinate system.', a: true, why: 'Right-handed, cameras look down −Z.' },
      { t: 'mcq', q: 'Your hard-surface model\'s custom normals are ignored in render. Likely fix?', o: ['Set subdivisionScheme = "none"', 'Add more points', 'Set kind', 'Make it a Scope'], a: 0, why: 'Normals are ignored when the mesh subdivides (catmullClark by default).' },
      { t: 'fill', q: 'One triangle.', lang: 'usda', code: `int[] ▢ = [3]\nint[] ▢ = [0, 1, 2]`, blanks: ['faceVertexCounts', 'faceVertexIndices'], extra: ['points', 'faceCounts'], why: 'Counts per face, then point indices per corner.' },
    ]},
  ]
});

// ------------------------------------------------------------ U13
UNITS.push({
  id: 'u13', part: 'p3', title: 'PRIMVARS', sub: 'Data that varies across surfaces', emoji: '🎨', color: '#1cb0f6', shadow: '#1899d6',
  items: [
    { id: 'u13l1', kind: 'lesson', title: 'What primvars are', steps: [
      { t: 'info', h: 'Primitive variables', p: `<b>Primvars</b> (from RenderMan's "primitive variables") are attributes that can <b>vary across a surface</b> and are handed to <b>shaders</b>: colours, UVs, wetness masks, per-instance tints…<br><br>They live in the <code>primvars:</code> namespace:<br><code>color3f[] primvars:displayColor</code><br><code>float[] primvars:displayOpacity</code><br><code>texCoord2f[] primvars:st</code> (UVs; "st" is the usual name)` },
      { t: 'info', h: 'Interpolation', p: `Each primvar has <b>interpolation</b> metadata saying how its values spread over the geometry:<br><br><span class="pill p">constant</span> one value for the whole prim<br><span class="pill b">uniform</span> one value per <b>face</b><br><span class="pill g">varying</span> per point, interpolated linearly even on subdivs<br><span class="pill g">vertex</span> one per <b>point</b>, following the surface's subdivision<br><span class="pill y">faceVarying</span> one per <b>face-vertex</b> (corner), so shared points can differ per face` },
      { t: 'widget', w: 'primvarInterp', h: 'See it', p: 'Pick an interpolation and see how many values the mesh needs.' },
      { t: 'match', q: 'Match interpolation to "one value per…"', pairs: [['constant', 'whole prim'], ['uniform', 'face'], ['vertex', 'point'], ['faceVarying', 'face-vertex (corner)']] },
      { t: 'mcq', q: 'UVs with seams (a corner has different UVs on each side) need…', o: ['constant', 'uniform', 'vertex', 'faceVarying'], a: 3, why: 'faceVarying stores a value per face-corner, so shared points can differ.' },
      { t: 'info', h: 'Key takeaways', p: `• Primvars = <code>primvars:</code> attributes that shaders read<br>• constant / uniform / varying / vertex / faceVarying<br>• UVs (<code>st</code>) are usually faceVarying` },
    ]},
    { id: 'u13l2', kind: 'lesson', title: 'Indexing & inheritance', steps: [
      { t: 'info', h: 'Indexed primvars', p: `If many elements share the same few values, store the unique values once plus an index array:`, lang: 'usda', code: `color3f[] primvars:displayColor = [(1,0,0), (0,0,1)] (\n    interpolation = "uniform"\n)\nint[] primvars:displayColor:indices = [0, 0, 1, 1, 0, 1]`, after: 'Six faces, two colours. Big meshes save lots of memory this way, and UVs are almost always indexed.' },
      { t: 'info', h: 'elementSize', p: `<code>elementSize</code> says how many array entries belong to <b>each element</b>. For example a primvar with 3 floats per point would have <code>elementSize = 3</code>.<div class="hou">🟠 <b>Houdini:</b> array attributes import as a primvar <i>plus</i> a <code>:lengths</code> primvar describing each element's length.</div>` },
      { t: 'info', h: 'Constant primvars inherit', p: `A <b>constant</b> primvar authored on an ancestor is <b>inherited</b> by every descendant gprim that doesn't have its own. Set <code>displayColor</code> on <code>/World/Forest</code> and every tree inside gets it.<br><br>This is also the main way to make <b>instanced</b> copies look different: constant primvars on the instance root reach inside the shared prototype.` },
      { t: 'tf', q: 'A constant displayColor on a parent Xform affects child meshes that don\'t author their own.', a: true, why: 'Constant primvars inherit down namespace.' },
      { t: 'mcq', q: 'A cube mesh: 6 faces, 8 points, 24 face-vertices. How many values for <b>uniform</b>?', o: ['1', '6', '8', '24'], a: 1, why: 'uniform = one per face.' },
      { t: 'mcq', q: 'Same cube with <b>vertex</b>?', o: ['6', '8', '12', '24'], a: 1, why: 'vertex = one per point.' },
      { t: 'info', h: 'Houdini mapping', p: `<div class="hou">🟠 <b>Houdini:</b> SOP attribute classes map straight onto interpolation:<br>detail → <b>constant</b> · primitive → <b>uniform</b> · point → <b>vertex</b> · vertex → <b>faceVarying</b><br><br>And <code>Cd</code> → <code>primvars:displayColor</code>, <code>Alpha</code> → <code>displayOpacity</code>, <code>uv</code> → <code>primvars:st</code>.</div>` },
      { t: 'mcq', q: 'A Houdini <b>vertex</b> attribute becomes which USD interpolation?', o: ['vertex', 'faceVarying', 'uniform', 'constant'], a: 1, why: 'Houdini vertices are face-corners, which is faceVarying in USD. Houdini points are USD vertex.' },
      { t: 'info', h: 'Key takeaways', p: `• Indexed primvars = unique values + <code>:indices</code><br>• Constant primvars <b>inherit</b> down the tree and reach into instances<br>• Houdini: detail/prim/point/vertex → constant/uniform/vertex/faceVarying` },
    ]},
    { id: 'u13d1', kind: 'drill', title: 'Primvar drill', steps: [
      { t: 'fill', q: 'Give the mesh per-point colours.', lang: 'usda', code: `color3f[] primvars:▢ = [(1,0,0), (0,1,0), …] (\n    interpolation = "▢"\n)`, blanks: ['displayColor', 'vertex'], extra: ['color', 'uniform', 'Cd'], why: 'displayColor + vertex interpolation = one colour per point.' },
      { t: 'mcq', q: 'Same cube with <b>faceVarying</b>?', o: ['6', '8', '12', '24'], a: 3, why: 'One per face-corner: 6 × 4.' },
      { t: 'tf', q: 'Houdini\'s uv attribute usually becomes primvars:st.', a: true, why: 'st is USD\'s conventional UV primvar.' },
      { t: 'mcq', q: 'What makes thousands of instanced trees have different tints?', o: ['Editing inside the prototype', 'Constant primvars on each instance root', 'More variants', 'Different kinds'], a: 1, why: 'Constant primvars on the instance prim inherit into the shared prototype.' },
      { t: 'match', q: 'Match Houdini → USD.', pairs: [['Cd', 'primvars:displayColor'], ['Alpha', 'primvars:displayOpacity'], ['N', 'normals'], ['P', 'points']] },
    ]},
  ]
});

// ------------------------------------------------------------ U14
UNITS.push({
  id: 'u14', part: 'p3', title: 'MODELS & PURPOSE', sub: 'Kinds, model hierarchy, purpose', emoji: '🏛️', color: '#1cb0f6', shadow: '#1899d6',
  items: [
    { id: 'u14l1', kind: 'lesson', title: 'Kind', steps: [
      { t: 'info', h: 'Why kind exists', p: `A big set can have millions of prims. Tools need a fast way to answer "<b>what are the assets in here?</b>" without walking every mesh.<br><br><b>kind</b> is prim metadata that labels the important levels:` , lang: 'usda', code: `def Xform "Chair" (\n    kind = "component"\n)\n{ … }` },
      { t: 'info', h: 'The kinds', p: `<span class="pill p">assembly</span> an important, often published group of models (a city block, a whole set)<br><span class="pill b">group</span> an organising branch of models (e.g. <code>Outskirts</code> inside a forest)<br><span class="pill g">component</span> a <b>leaf asset</b>: a chair, a tree, a character<br><span class="pill y">subcomponent</span> an important part <b>inside</b> a component (e.g. a door you might animate)<br><br><code>model</code> is the abstract parent kind and should <b>never be assigned</b> directly. group, assembly and component are all "models".` },
      { t: 'order', q: 'Order from broadest to narrowest.', items: ['assembly', 'group', 'component', 'subcomponent'], why: 'assembly ⊃ group ⊃ component ⊃ subcomponent' },
      { t: 'info', h: 'Model hierarchy rules', p: `The <b>model hierarchy</b> is a contiguous chain of models from the root down:<br><br>• Only <b>groups</b> (incl. assemblies) may contain other models<br>• So every ancestor of a component must be a group or assembly<br>• A <b>component cannot contain models</b>, only subcomponents and ordinary prims<br><br>If a component references another published asset, that inner asset must have its kind overridden to <code>subcomponent</code>.` },
      { t: 'mcq', q: 'Which hierarchy is invalid?', o: ['assembly › group › component', 'group › component', 'component › component', 'assembly › component'], a: 2, why: 'Components can\'t contain other models.' },
      { t: 'mcq', q: 'Which kind should a single published prop like "Teapot" have?', o: ['assembly', 'group', 'component', 'model'], a: 2, why: 'Leaf assets are components. Never assign "model".' },
      { t: 'info', h: 'Key takeaways', p: `• <b>kind</b> labels assets: assembly › group › component › subcomponent<br>• Only groups contain models, so components are leaves<br>• Never assign <code>model</code> directly` },
    ]},
    { id: 'u14l2', kind: 'lesson', title: 'Purpose & draw mode', steps: [
      { t: 'info', h: 'Purpose', p: `<code>purpose</code> is an attribute that classifies geometry so renderers and viewers can include or exclude it:<br><br><b>default</b>: always drawn (the fallback)<br><b>render</b>: only in final-quality renders<br><b>proxy</b>: a lightweight stand-in for the viewport<br><b>guide</b>: helpers such as rig curves and bounds, hidden by default<br><br>A prim without an authored purpose <b>inherits</b> it from its closest ancestor.` },
      { t: 'info', h: 'Proxy + render pairs', p: `A common asset layout puts two siblings under <code>geo</code>:<br><code>/Tree/geo/proxy</code> (purpose = proxy, 500 polys)<br><code>/Tree/geo/render</code> (purpose = render, 2M polys)<br><br>The viewport shows proxy, the final render shows render, and both <b>exist at the same time</b>, so you can still inspect the render geo. That's why this beats a variant.` },
      { t: 'mcq', q: 'Your viewport should show a 500-poly tree while Karma renders the 2M-poly version. Purposes?', o: ['render + guide', 'proxy + render', 'default + guide', 'proxy + default'], a: 1, why: 'proxy for interactive display, render for final frames.' },
      { t: 'tf', q: 'A mesh without an authored purpose inherits its parent\'s purpose.', a: true, why: 'Purpose inherits from the closest ancestor that authors it.' },
      { t: 'info', h: 'Draw mode', p: `For huge scenes, model prims can be told to draw as a <b>box</b>, <b>origin</b> axes or textured <b>cards</b> in the viewport via <code>model:drawMode</code> (from UsdGeomModelAPI), even when fully loaded.<div class="hou">🟠 <b>Houdini:</b> the <b>Draw Mode LOP</b> sets this.</div>` },
      { t: 'info', h: 'Key takeaways', p: `• Purpose: default / render / proxy / guide, inherited down the tree<br>• Proxy + render siblings beat variants for viewport stand-ins<br>• <code>model:drawMode</code> can show models as boxes or cards` },
    ]},
    { id: 'u14d1', kind: 'drill', title: 'Model drill', steps: [
      { t: 'match', q: 'Match the purpose.', pairs: [['proxy', 'Fast viewport stand-in'], ['render', 'Final frames only'], ['guide', 'Helper, hidden by default'], ['default', 'Always drawn']] },
      { t: 'tf', q: 'You should assign kind = "model" to your assets.', a: false, why: 'model is abstract. Use component, group or assembly.' },
      { t: 'mcq', q: 'A door inside a house component that animators need to find quickly. Kind?', o: ['component', 'subcomponent', 'group', 'assembly'], a: 1, why: 'Important parts inside a component are subcomponents.' },
      { t: 'mcq', q: 'A forest set made of tree components, organised into Outskirts and Glade branches. Kinds for Forest / Outskirts?', o: ['assembly / group', 'component / component', 'group / component', 'model / model'], a: 0, why: 'A published set is an assembly, and organising branches are groups.' },
    ]},
  ]
});

// ------------------------------------------------------------ U15
UNITS.push({
  id: 'u15', part: 'p3', title: 'INSTANCING', sub: 'Native instances & point instancers', emoji: '🌲', color: '#1cb0f6', shadow: '#1899d6',
  items: [
    { id: 'u15l1', kind: 'lesson', title: 'Native instancing', steps: [
      { t: 'info', h: 'instanceable = true', p: `If 1,000 prims reference the same tree with <b>identical composition arcs</b>, USD would normally compose 1,000 copies. Mark them <b>instanceable</b> and USD builds <b>one shared prototype</b> instead:`, lang: 'usda', code: `def "Tree_001" (\n    instanceable = true\n    prepend references = @./tree.usda@\n) { double3 xformOp:translate = (3,0,1) … }`, after: 'Prototypes are created implicitly. You never author them.' },
      { t: 'widget', w: 'instancing', h: 'A forest', p: 'Toggle instancing and watch memory. Then try editing a tree.' },
      { t: 'info', h: 'The trade-off', p: `Prims below an instance are <b>instance proxies</b>, and they're <b>read-only</b>. Opinions authored under an instance are ignored.<br><br>You <b>can</b> still edit the <b>instance prim itself</b>: its transform, visibility, constant primvars, and its <b>variant selections</b>. Instances with different selections get different prototypes.<br><br>To fully customise one copy, author <code>instanceable = false</code> on it in a stronger layer.` },
      { t: 'tf', q: 'You can author a new colour on /Forest/Tree_007/Leaves while Tree_007 is instanceable.', a: false, why: 'Leaves is an instance proxy, so it\'s read-only. Edit the instance root\'s primvars or de-instance it.' },
      { t: 'mcq', q: '1,000 instanceable trees use 2 different variant selections. Roughly how many prototypes?', o: ['1', '2', '1,000', '0'], a: 1, why: 'Instances with identical composition share a prototype, and two selections means two.' },
      { t: 'info', h: 'Key takeaways', p: `• <code>instanceable = true</code> + identical arcs gives one shared prototype<br>• Descendants are read-only <b>instance proxies</b><br>• Edit the instance root (xform, primvars, variant selection), or de-instance it` },
    ]},
    { id: 'u15l2', kind: 'lesson', title: 'PointInstancer', steps: [
      { t: 'info', h: 'Millions of things', p: `<b>UsdGeom.PointInstancer</b> stamps <b>prototypes</b> using arrays, with no prim per copy. It's ideal for grass, rocks, debris and crowds from a scatter.`, lang: 'usda', code: `def PointInstancer "Rocks" {\n    rel prototypes = [</Rocks/Protos/A>, </Rocks/Protos/B>]\n    int[] protoIndices = [0, 1, 1, 0]\n    point3f[] positions = [(0,0,0), (2,0,1), (4,0,0), (6,0,2)]\n    quath[] orientations = [ … ]\n    float3[] scales = [ … ]\n    int64[] invisibleIds = [2]\n}` },
      { t: 'info', h: 'The arrays', p: `• <code>prototypes</code>: a relationship to the source prims (usually children of the instancer)<br>• <code>protoIndices</code>: which prototype goes at each point (an index into prototypes)<br>• <code>positions</code>, <code>orientations</code> (quaternions), <code>scales</code><br>• <code>velocities</code>, <code>angularVelocities</code>: for motion blur<br>• <code>ids</code> + <code>invisibleIds</code>: hide individual instances by id<br>• per-instance primvars use <b>vertex</b> interpolation (one value per instance)` },
      { t: 'match', q: 'Match the attribute.', pairs: [['prototypes', 'rel to source prims'], ['protoIndices', 'which prototype per point'], ['orientations', 'rotation (quats)'], ['invisibleIds', 'hide some instances']] },
      { t: 'tf', q: 'protoIndices = [1,1,0] places prototype B at the first two points.', a: true, why: 'Index 1 = the second prototype in the rel.' },
      { t: 'mcq', q: 'Native instances vs point instances: which gives each copy its <b>own prim</b> you can select?', o: ['Native instancing', 'PointInstancer', 'Both', 'Neither'], a: 0, why: 'Native instances are real prims. Point instances are just array entries.' },
      { t: 'info', h: 'Which to use?', p: `• <b>Native instancing</b>: hundreds to thousands of hero-ish copies that layout moves individually. Each one is a selectable prim.<br>• <b>PointInstancer</b>: tens of thousands to millions, generated procedurally.<div class="hou">🟠 <b>Houdini:</b> the <b>Instancer</b>/<b>Copy to Points</b> LOPs can create either kind, and packed prims from SOPs can import as either. Houdini also supports "heroing" an instance into a real, editable prim with <b>Extract Instances</b>.</div>` },
      { t: 'info', h: 'Key takeaways', p: `• PointInstancer = prototypes + protoIndices + positions/orientations/scales arrays<br>• Hide with ids + invisibleIds. Per-instance primvars are vertex-interpolated<br>• Native for selectable copies, PointInstancer for massive counts` },
    ]},
    { id: 'u15d1', kind: 'drill', title: 'Instancing drill', steps: [
      { t: 'mcq', q: 'Read-only prims under an instance are called…', o: ['Prototypes', 'Instance proxies', 'Overs', 'Payloads'], a: 1, why: 'Instance proxies.' },
      { t: 'mcq', q: 'Best for 5 million grass blades?', o: ['5M referenced prims', 'Native instancing', 'PointInstancer', 'Variants'], a: 2, why: 'Arrays scale to millions. Prims don\'t.' },
      { t: 'fill', q: 'Make it instanceable.', lang: 'usda', code: `def "Rock_12" (\n    ▢ = true\n    prepend references = @./rock.usd@\n) {}`, blanks: ['instanceable'], extra: ['instance', 'prototype', 'shared'], why: 'instanceable = true' },
      { t: 'mcq', q: 'Which edit is allowed on an instance?', o: ['Change a mesh point under it', 'Move the instance prim itself', 'Rename a child', 'Add a child'], a: 1, why: 'The instance root is a normal prim. Its descendants are proxies.' },
      { t: 'tf', q: 'Instancing only works if the prims have composition arcs (e.g. references).', a: true, why: 'instanceable only takes effect on prims with arcs, since that\'s what makes them shareable.' },
    ]},
  ]
});

// ------------------------------------------------------------ U16
UNITS.push({
  id: 'u16', part: 'p3', title: 'MATERIALS', sub: 'UsdShade networks & binding', emoji: '🧪', color: '#1cb0f6', shadow: '#1899d6',
  items: [
    { id: 'u16l1', kind: 'lesson', title: 'Shading networks', steps: [
      { t: 'info', h: 'Three building blocks', p: `<b>UsdShade</b> describes materials as networks of prims:<br><br><b>Shader</b>: one node (a texture lookup, a surface BSDF…)<br><b>NodeGraph</b>: a reusable container of shaders with its own inputs and outputs<br><b>Material</b>: the container you <b>bind</b> to geometry. It exposes outputs like <code>outputs:surface</code><br><br>Shaders must live <b>inside</b> a Material or NodeGraph (that's called encapsulation).` },
      { t: 'info', h: 'Inputs, outputs, connections', lang: 'usda', code: `def Material "Red" {\n    token outputs:surface.connect = </Mats/Red/PBR.outputs:surface>\n    def Shader "PBR" {\n        uniform token info:id = "UsdPreviewSurface"\n        color3f inputs:diffuseColor = (0.9, 0.1, 0.1)\n        float inputs:roughness = 0.4\n        token outputs:surface\n    }\n}`, p: 'Parameters are attributes in the <code>inputs:</code> and <code>outputs:</code> namespaces.', after: `• Connections are authored on the <b>consumer</b>, pointing at the producer<br>• A connected input <b>ignores its own value</b><br>• <code>info:id</code> names which shader this node is` },
      { t: 'tap', q: 'Tap what identifies the shader type.', code: `def Shader "PBR" {\n    uniform token ⟦info:id⟧ = "UsdPreviewSurface"\n    color3f ⟦inputs:diffuseColor⟧ = (1,1,1)\n    token ⟦outputs:surface⟧\n}`, a: 0, why: 'info:id names the shader node definition.' },
      { t: 'info', h: 'UsdPreviewSurface', p: `The portable, "works everywhere" shader. Main inputs:<br><code>diffuseColor roughness metallic opacity emissiveColor normal clearcoat ior</code><br><br>Companions: <b>UsdUVTexture</b> reads an image (<code>inputs:file = @tex.png@</code>, giving <code>outputs:rgb</code>), and <b>UsdPrimvarReader_float2</b> reads UVs (<code>st</code>).` },
      { t: 'order', q: 'Order a texture network, data flowing left → right.', items: ['UsdPrimvarReader_float2 (st)', 'UsdUVTexture', 'UsdPreviewSurface', 'Material outputs:surface'], why: 'UVs → texture lookup → surface → material output' },
      { t: 'info', h: 'Render contexts', p: `One Material can carry networks for several renderers side by side, each on its own output:<br><br><code>outputs:surface</code>: the universal context (UsdPreviewSurface)<br><code>outputs:mtlx:surface</code>: MaterialX<br><code>outputs:ri:surface</code>: RenderMan<br><br>Each renderer picks the output it understands and falls back to the universal one.<div class="hou">🟠 <b>Houdini:</b> Karma materials built from MaterialX nodes use the <code>mtlx</code> context.</div>` },
      { t: 'mcq', q: 'Renderer-specific outputs (e.g. MaterialX for Karma) use…', o: ['A separate material', 'A render-context output like outputs:mtlx:surface', 'A variant', 'A payload'], a: 1, why: 'Render contexts let one Material serve several renderers.' },
      { t: 'info', h: 'Interface inputs', p: `Materials and NodeGraphs can expose <b>public inputs</b> (e.g. <code>inputs:baseColor</code> on the Material) that inner shader inputs connect to. Artists then tweak the Material's interface, not the guts.<br><br>If an interface input has no value, the inner shader's own value is used. Through nested NodeGraphs, the <b>outermost</b> authored value wins.` },
      { t: 'info', h: 'Key takeaways', p: `• Material ⊃ NodeGraph ⊃ Shader, connected via <code>inputs:</code>/<code>outputs:</code><br>• UsdPreviewSurface + UsdUVTexture + PrimvarReader is the portable trio<br>• Render contexts (<code>outputs:mtlx:surface</code>…) let one material serve many renderers` },
    ]},
    { id: 'u16l2', kind: 'lesson', title: 'Binding', steps: [
      { t: 'info', h: 'material:binding', p: `Apply <b>MaterialBindingAPI</b> and point the relationship at a Material:`, lang: 'usda', code: `def Mesh "Body" (\n    prepend apiSchemas = ["MaterialBindingAPI"]\n)\n{\n    rel material:binding = </Mats/Red>\n}`, after: `<div class="warn">⚠️ If MaterialBindingAPI isn't applied, renderers may <b>ignore</b> the binding.</div>` },
      { t: 'widget', w: 'materialBind', h: 'Binding inheritance', p: 'Bind materials on the parent or children and see what each part resolves to.' },
      { t: 'info', h: 'Resolution rules', p: `• Bindings are <b>inherited</b>: a mesh without a binding uses its nearest bound ancestor's material.<br>• By default the <b>closest binding wins</b>, so a child's own binding beats its parent's. This is called <code>weakerThanDescendants</code>.<br>• Author <code>bindMaterialAs = "strongerThanDescendants"</code> on a parent's binding to make it override its children.` },
      { t: 'mcq', q: '/Car is bound to Red. /Car/Wheel is bound to Rubber. What does Wheel get?', o: ['Red', 'Rubber', 'Nothing', 'Both'], a: 1, why: 'The descendant\'s own binding wins by default.' },
      { t: 'mcq', q: 'Same, but /Car\'s binding has bindMaterialAs = "strongerThanDescendants". Wheel?', o: ['Red', 'Rubber'], a: 0, why: 'strongerThanDescendants flips the rule.' },
      { t: 'info', h: 'Purposes & collections', p: `• <b>Purpose-specific bindings</b>: <code>material:binding:preview</code> (for fast viewports) and <code>material:binding:full</code> (for final renders) sit alongside the all-purpose <code>material:binding</code>.<br>• <b>Collection-based bindings</b> bind one material to a whole collection of prims: <code>rel material:binding:collection:Metal = [&lt;/World.collection:metalParts&gt;, &lt;/Mats/Chrome&gt;]</code><br>• <b>GeomSubsets</b> get their own bindings for per-face materials.` },
      { t: 'tf', q: 'A prim can have a different material for preview and for final render.', a: true, why: 'material:binding:preview and material:binding:full.' },
      { t: 'info', h: 'Key takeaways', p: `• Apply <b>MaterialBindingAPI</b>, then <code>rel material:binding</code><br>• Inherited, closest wins, unless <code>strongerThanDescendants</code><br>• Purpose bindings (preview/full), collection bindings, subset bindings` },
    ]},
    { id: 'u16d1', kind: 'drill', title: 'Shading drill', steps: [
      { t: 'fill', q: 'Wire up the surface.', lang: 'usda', code: `def Material "Gold" {\n    token outputs:surface.▢ = </Mats/Gold/PBR.outputs:surface>\n    def Shader "PBR" {\n        uniform token info:id = "▢"\n    }\n}`, blanks: ['connect', 'UsdPreviewSurface'], extra: ['link', 'Principled', 'bind'], why: '.connect + UsdPreviewSurface' },
      { t: 'match', q: 'Match the shader.', pairs: [['UsdPreviewSurface', 'The surface BSDF'], ['UsdUVTexture', 'Reads an image file'], ['UsdPrimvarReader_float2', 'Reads UVs (st)']] },
      { t: 'mcq', q: 'Which PreviewSurface input makes something glow?', o: ['diffuseColor', 'emissiveColor', 'opacity', 'clearcoat'], a: 1, why: 'emissiveColor.' },
      { t: 'tf', q: 'A connected shader input still uses its own authored value.', a: false, why: 'A valid connection overrides the authored value.' },
      { t: 'mcq', q: 'Binding strength when nothing is authored?', o: ['strongerThanDescendants', 'weakerThanDescendants', 'none', 'inherited'], a: 1, why: 'The fallback is weakerThanDescendants: closest binding wins.' },
    ]},
  ]
});

// ------------------------------------------------------------ U17
UNITS.push({
  id: 'u17', part: 'p3', title: 'LIGHTS & CAMERAS', sub: 'UsdLux and UsdGeomCamera', emoji: '💡', color: '#1cb0f6', shadow: '#1899d6',
  items: [
    { id: 'u17l1', kind: 'lesson', title: 'UsdLux lights', steps: [
      { t: 'info', h: 'What makes a light', p: `In UsdLux, a light is <b>any prim with LightAPI applied</b>. Built-in light types already have it:<br><br><b>DistantLight</b>: the sun, light from one direction<br><b>DomeLight</b>: environment / HDRI all around<br><b>RectLight</b>, <b>DiskLight</b>, <b>SphereLight</b>, <b>CylinderLight</b>: area lights<br><b>MeshLightAPI</b>: turns any Mesh into a light<br><b>PortalLight</b>: focuses dome sampling through windows<br><br>There are deliberately <b>no zero-size point lights</b>, because UsdLux is built for physically based area lighting.` },
      { t: 'info', h: 'Conventions', p: `• Lights are <b>Xformable</b>, so they move and inherit transforms like anything else<br>• Lights with a main direction <b>emit along −Z</b><br>• Area lights are centred in the XY plane, 1 unit across by default<br>• Light parameters live under <code>inputs:</code> because lights are connectable, like shaders` },
      { t: 'mcq', q: 'An unrotated RectLight shines in which direction?', o: ['+Y', '−Z', '+Z', '+X'], a: 1, why: 'UsdLux lights emit along −Z by convention.' },
      { t: 'info', h: 'Brightness', lang: 'usda', code: `def RectLight "Key" {\n    float inputs:intensity = 10\n    float inputs:exposure = 2        # ×2² = ×4\n    color3f inputs:color = (1, 0.9, 0.8)\n    bool inputs:enableColorTemperature = true\n    float inputs:colorTemperature = 5600\n    bool inputs:normalize = false\n}`, p: 'Brightness = <b>intensity × 2^exposure</b> × colour.', after: `<code>normalize = true</code> keeps total power constant as you resize the light: bigger lights get dimmer per unit area. Distance falloff is physical, from geometry, with no separate falloff control.` },
      { t: 'mcq', q: 'intensity 5, exposure 1. Effective multiplier?', o: ['5', '6', '10', '25'], a: 2, why: '5 × 2¹ = 10.' },
      { t: 'info', h: 'Light linking', p: `Each light has two built-in collections:<br>• <code>collection:lightLink</code>: which geometry it <b>illuminates</b><br>• <code>collection:shadowLink</code>: which geometry <b>casts shadows</b> from it<br><br>Both include everything by default (<code>includeRoot = true</code>). Exclude the hero's face from the rim light, and so on. <b>ShapingAPI</b> adds cone angle, focus and IES profiles. <b>ShadowAPI</b> adds shadow colour and falloff.<div class="hou">🟠 <b>Houdini:</b> the <b>Light Linker LOP</b> authors these collections from rules.</div>` },
      { t: 'tf', q: 'By default a UsdLux light illuminates every object in the scene.', a: true, why: 'lightLink includes the root by default.' },
      { t: 'info', h: 'Key takeaways', p: `• Light = prim with <b>LightAPI</b>. Distant, Dome, Rect, Disk, Sphere, Cylinder, Mesh, Portal<br>• Emits along <b>−Z</b>. Brightness = intensity × 2^exposure<br>• <code>lightLink</code>/<code>shadowLink</code> collections control what's lit and what shadows` },
    ]},
    { id: 'u17l2', kind: 'lesson', title: 'Cameras', steps: [
      { t: 'info', h: 'UsdGeomCamera', p: `A <b>Camera</b> prim is Xformable and looks down its local <b>−Z</b>, with +Y up. Key attributes:`, lang: 'usda', code: `def Camera "shotCam" {\n    float focalLength = 35\n    float horizontalAperture = 36\n    float verticalAperture = 24\n    float2 clippingRange = (1, 100000)\n    token projection = "perspective"\n    float fStop = 2.8\n    float focusDistance = 500\n}` },
      { t: 'info', h: 'Units gotcha', p: `<code>focalLength</code> and the apertures are expressed in <b>tenths of a scene unit</b> by convention. If your scene is in centimetres, 35 means 35 mm, which is why it "just works" in cm scenes.<br><br>Set <code>fStop</code> above 0 to enable depth of field. <code>projection</code> is <code>perspective</code> or <code>orthographic</code>.` },
      { t: 'mcq', q: 'Which attribute turns on depth of field when > 0?', o: ['focalLength', 'fStop', 'clippingRange', 'projection'], a: 1, why: 'fStop > 0 enables DOF, together with focusDistance.' },
      { t: 'tf', q: 'A USD camera looks down its local −Z axis.', a: true, why: 'Same convention as lights.' },
      { t: 'info', h: 'Key takeaways', p: `• Camera looks down −Z. focalLength and apertures are in tenths of a scene unit (mm in a cm scene)<br>• fStop + focusDistance for DOF. Clipping range, projection` },
    ]},
    { id: 'u17d1', kind: 'drill', title: 'Light drill', steps: [
      { t: 'match', q: 'Match the light.', pairs: [['DistantLight', 'The sun'], ['DomeLight', 'HDRI environment'], ['RectLight', 'Softbox'], ['PortalLight', 'Window for dome sampling']] },
      { t: 'mcq', q: 'Which collection decides which objects CAST SHADOWS from a light?', o: ['lightLink', 'shadowLink', 'filterLink', 'material:binding'], a: 1, why: 'shadowLink.' },
      { t: 'tf', q: 'UsdLux includes an infinitely small point light type.', a: false, why: 'UsdLux is area-light based. Use a small SphereLight.' },
      { t: 'mcq', q: 'normalize = true does what when you scale up a RectLight?', o: ['Gets brighter', 'Keeps total power constant', 'Turns it off', 'Changes colour'], a: 1, why: 'Normalize divides by area, so total power stays the same.' },
    ]},
  ]
});

// ------------------------------------------------------------ U18
UNITS.push({
  id: 'u18', part: 'p3', title: 'COLLECTIONS & RENDER', sub: 'Collections, render settings, advanced bits', emoji: '🎬', color: '#1cb0f6', shadow: '#1899d6',
  items: [
    { id: 'u18l1', kind: 'lesson', title: 'Collections', steps: [
      { t: 'info', h: 'Named sets of prims', p: `A <b>collection</b> names a set of prims (and optionally properties) for things like light linking, material binding and render passes. It's a multiple-apply API schema, so a prim can carry many: <code>collection:metal</code>, <code>collection:hero</code>…<br><br>Membership is defined in one of two <b>modes</b>.` },
      { t: 'info', h: 'Relationship mode', lang: 'usda', code: `def Xform "World" (\n    prepend apiSchemas = ["CollectionAPI:buildings"]\n)\n{\n    uniform token collection:buildings:expansionRule = "expandPrims"\n    rel collection:buildings:includes = [</World/BldgA>, </World/BldgB>]\n    rel collection:buildings:excludes = [</World/BldgA/Floor13>]\n}`, p: 'Explicit include and exclude lists:', after: `<code>expansionRule</code>: <code>explicitOnly</code> (just the listed paths), <code>expandPrims</code> (plus all descendants), or <code>expandPrimsAndProperties</code>. Collections can include other collections.` },
      { t: 'info', h: 'Expression mode', lang: 'usda', code: `pathExpression collection:shirts:membershipExpression = "/World/Clothing/Shirts/Red*//"`, p: 'Newer USD supports <b>pattern-based</b> collections using path expressions:', after: `<code>*</code> matches within a name, <code>//</code> means "and everything below". Expression-mode collections stay correct as the scene changes, with no need to re-list paths.` },
      { t: 'mcq', q: 'A collection should include /City/BldgA and everything under it, except Floor13. Which pieces?', o: ['includes + excludes with expandPrims', 'A variant', 'A payload', 'explicitOnly with one path'], a: 0, why: 'expandPrims includes descendants. excludes carves out Floor13.' },
      { t: 'info', h: 'Key takeaways', p: `• Collections = named prim sets (CollectionAPI:name)<br>• Relationship mode: includes/excludes + expansionRule<br>• Expression mode: <code>membershipExpression</code> path patterns` },
    ]},
    { id: 'u18l2', kind: 'lesson', title: 'Render settings', steps: [
      { t: 'info', h: 'UsdRender', p: `<b>UsdRender</b> schemas describe <b>how</b> to render, inside the scene itself:<br><br><b>RenderSettings</b>: global setup: camera, resolution, which products, <code>includedPurposes</code><br><b>RenderProduct</b>: one output artifact (usually an image file, <code>productName</code>), and it can override settings<br><b>RenderVar</b>: one channel / AOV (beauty, alpha, depth, an LPE…)<br><b>RenderPass</b>: for multi-pass setups` },
      { t: 'info', h: 'Example', lang: 'usda', code: `#usda 1.0\n( renderSettingsPrimPath = "/Render/PrimarySettings" )\ndef Scope "Render" {\n    def RenderSettings "PrimarySettings" {\n        rel camera = </World/shotCam>\n        int2 resolution = (1920, 1080)\n        rel products = </Render/Beauty>\n    }\n    def RenderProduct "Beauty" {\n        token productName = "render.0001.exr"\n        rel orderedVars = [</Render/Vars/color>]\n    }\n    def Scope "Vars" {\n        def RenderVar "color" { string sourceName = "Ci" }\n    }\n}`, p: 'Best practice: group everything under <code>/Render</code> and point layer metadata at the default settings.' },
      { t: 'match', q: 'Match.', pairs: [['RenderSettings', 'Global setup'], ['RenderProduct', 'One output file'], ['RenderVar', 'One channel / AOV'], ['renderSettingsPrimPath', 'Default settings pointer']] },
      { t: 'mcq', q: 'Settings has <code>includedPurposes = ["default", "proxy"]</code>. Which geometry renders?', o: ['Everything', 'Default and proxy, but not render or guide', 'Only proxy', 'Only render'], a: 1, why: 'includedPurposes filters by purpose.' },
      { t: 'info', h: 'Key takeaways', p: `• RenderSettings → RenderProducts → RenderVars, under <code>/Render</code><br>• <code>renderSettingsPrimPath</code> names the default. <code>includedPurposes</code> filters geometry` },
    ]},
    { id: 'u18l3', kind: 'lesson', title: 'Under the hood', steps: [
      { t: 'info', h: 'Asset resolution', p: `Every <code>@asset path@</code> goes through the <b>asset resolver</b> (the Ar library), which turns an identifier into a real location. The default resolver handles relative and search paths. Studios plug in custom resolvers, for example to map <code>@asset:chair?v=12@</code> to a database.<br><br><b>Relative paths</b> like <code>@./tex.png@</code> are anchored to <b>the layer that wrote them</b>, not to the current working directory.` },
      { t: 'mcq', q: 'tex.png is referenced as @./tex.png@ inside /proj/assets/chair/geo.usd. Where does USD look?', o: ['The current working directory', '/proj/assets/chair/tex.png', 'Next to the shot file', '$HOME'], a: 1, why: 'Relative asset paths are anchored to the authoring layer.' },
      { t: 'info', h: 'Value clips', p: `For huge animated caches, writing one file per frame and stitching them into a single layer is slow. <b>Value clips</b> let a prim pull its time samples from a <b>sequence of files</b>, like clips on a video timeline, via <code>clips</code> metadata (assetPaths, active, times, manifest).<div class="hou">🟠 <b>Houdini:</b> the <b>USD Stitch Clips</b> ROP builds value clips from per-frame files.</div>` },
      { t: 'info', h: 'Hydra', p: `<b>Hydra</b> is USD's rendering architecture. A <b>scene delegate</b> feeds the scene in, the <b>render index</b> tracks changes, and <b>render delegates</b> draw it. Storm (Pixar's OpenGL/Vulkan/Metal), Karma, RenderMan, Arnold and others are render delegates, which is why the same USD scene can be viewed with different renderers in one viewport.` },
      { t: 'match', q: 'Match.', pairs: [['Ar', 'Resolves asset paths'], ['Value clips', 'Animation spread over many files'], ['Hydra', 'Rendering architecture'], ['Storm', 'Pixar\'s real-time delegate']] },
      { t: 'info', h: 'Validation', p: `Recent USD has a <b>validation framework</b>: <b>validators</b> are individual checks (e.g. "MaterialBindingAPI applied?"), grouped into contexts and suites. Errors can carry <b>fixers</b>. usdview exposes it under Window ▸ USD Validation, and <code>usdchecker</code> runs it from the command line.` },
      { t: 'info', h: 'Key takeaways', p: `• Ar resolves <code>@paths@</code>. Relative paths anchor to the authoring layer<br>• Value clips = time samples across many files<br>• Hydra + render delegates = any renderer, same scene. Validators check your files` },
    ]},
    { id: 'u18c1', kind: 'challenge', title: 'Scene domains boss', timed: true, steps: [
      { t: 'mcq', q: 'Container for lights that never moves:', o: ['Xform', 'Scope'], a: 1, why: 'Scope.' },
      { t: 'mcq', q: '[translate, rotate, scale]: first op applied to points?', o: ['translate', 'rotate', 'scale'], a: 2, why: 'Right to left.' },
      { t: 'mcq', q: 'Per-face-corner UVs need interpolation…', o: ['vertex', 'uniform', 'faceVarying'], a: 2, why: 'faceVarying.' },
      { t: 'mcq', q: 'A subdivided mesh ignores…', o: ['points', 'authored normals', 'extent'], a: 1, why: 'Normals are ignored under subdivision.' },
      { t: 'mcq', q: 'Leaf asset kind:', o: ['assembly', 'component', 'model'], a: 1, why: 'component.' },
      { t: 'tf', q: 'Instance proxies are editable.', a: false, why: 'Read-only.' },
      { t: 'mcq', q: 'Child binding vs parent binding (default strength):', o: ['Child wins', 'Parent wins'], a: 0, why: 'weakerThanDescendants.' },
      { t: 'mcq', q: 'Lights emit along…', o: ['+Z', '−Z', '+Y'], a: 1, why: '−Z.' },
      { t: 'mcq', q: 'One output image file = a…', o: ['RenderVar', 'RenderProduct', 'RenderSettings'], a: 1, why: 'RenderProduct.' },
    ]},
  ]
});
