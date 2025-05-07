var algtop = {};

algtop.flat = function(a) {
 var b = [];
 for (i = 0; i < a.length; i++) {
  b = b.concat(a[i]);
 }

 return b;
}

algtop.bab = {};

algtop.bab.vect = function(v) {
 if (Array.isArray(v)) {
  return new BABYLON.Vector3(v[0],v[1],v[2]);
 }

 if (('x' in v) && ('y' in v) && ('z' in v)) {
  return new BABYLON.Vector3(v.x,v.y,v.z);
 }

 if ((0 in v) && (1 in v) && (2 in v)) {
  return new BABYLON.Vector3(v[0],v[1],v[2]);
 }

 return new BABYLON.Vector3(0,0,0);
}

algtop.bab.unvect = function(v) {
 if (Array.isArray(v)) {
  return [v[0],v[1],v[2]];
 }

 if (('x' in v) && ('y' in v) && ('z' in v)) {
  return [v.x,v.y,v.z];
 }

 if ((0 in v) && (1 in v) && (2 in v)) {
  return [v[0],v[1],v[2]];
 }

 return [0,0,0];
}

algtop.bab.col0 = function(c) {
 if (Array.isArray(c)) { return c; }

 if (('r' in c) && ('g' in c) && ('b' in c)) {
  if ('a' in c) {
   return [c.r,c.g,c.b,c.a];
  } else {
   return [c.r,c.g,c.b,1];
  }
 }

 if ((0 in c) && (1 in c) && (2 in c)) {
  if (3 in c) {
   return [c[0],c[1],c[2],c[3]];
  } else {
   return [c[0],c[1],c[2],1];
  }
 }

 return [0,0,0,0];
}

algtop.bab.col3 = function(c) {
 var c0 = algtop.bab.col0(c);
 return new BABYLON.Color3(c0[0],c0[1],c0[2]);
}

algtop.bab.col4 = function(c) {
 var c0 = algtop.bab.col0(c);
 return new BABYLON.Color4(c0[0],c0[1],c0[2],c0[3]);
}


algtop.bab.point = function(u,c,d,scene) {
 var col = this.col4(c);
 var mesh = BABYLON.MeshBuilder.CreateSphere("point", {diameter : d}, scene);
 algtop.set_colour(mesh,c[0],c[1],c[2]);
 var p = this.vect(u);
 mesh.position = p;
 var q = mesh.position;
 return mesh;
}

algtop.bab.line = function(u,v,c,scene) {
 var col = this.col4(c);
 var pts = [this.vect(u), this.vect(v)];
 var mesh = 
  BABYLON.MeshBuilder.CreateLines("line",
   {points : pts, colors : [col, col]}, scene);
 mesh.points = pts;
 return mesh;
}

algtop.bab.triangle = function(u,v,w,c,scene) {
 var col = this.col4(c);
 var grid = new BABYLON.VertexData();
 grid.positions = algtop.flat([this.unvect(u),this.unvect(v),this.unvect(w)]);
 grid.indices = [0,1,2];
 var mesh = new BABYLON.Mesh("triangle",scene);
 grid.applyToMesh(mesh);
 algtop.set_colour(mesh,c[0],c[1],c[2]);
 return mesh;
}
 
algtop.bab.label = function(u,t,scene) {
 var x = {};
 var u0 = algtop.bab.vect(u);
 var n = u0.subtract(scene.camera.position);
 x.source_plane = new BABYLON.Plane(-n.x,-n.y,-n.z,0);
 x.source_plane.normalize();

 var opts = {
  sourcePlane : x.source_plane,
  updatable : true
 };

 x.label_plane = BABYLON.MeshBuilder.CreatePlane('plane_' + v.name,opts,this.scene);
 x.label_plane.position = u0;
 x.label_plane.sourcePlane = x.source_plane;
 x.plane_texture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(x.label_plane);
 x.button = BABYLON.GUI.Button.CreateSimpleButton(null, t);
 x.button.width  = 0.2;
 x.button.height = 0.2;
 x.button.color  = 'black';
 x.button.background = 'white';
 x.button.fontSize = 200;
 x.plane_texture.addControl(x.button);

 return x;
}

/***********************************************************************/

algtop.tetrahedron_embedding = function(t) {
 return [Math.sqrt(2)*(2*t[1]-t[2]-t[3])/3,
         Math.sqrt(2/3)*(t[2]-t[3]),
	 t[0]-(t[1]+t[2]+t[3])/3];
}

/***********************************************************************/

algtop.surface = {};
algtop.surface.n = 48;
algtop.surface.m = 48;
algtop.surface.colour = {r : 0.5, g : 0.5, b : 1};

/***********************************************************************/
algtop.torus = Object.create(algtop.surface);
algtop.torus.name = 'torus';
algtop.torus.R = 2;
algtop.torus.r = 1;

algtop.torus.embedding = function(t,u) {
 var tau = 2 * Math.PI;
 var cu = Math.cos(tau * u);
 var su = Math.sin(tau * u);
 var ct = Math.cos(tau * t);
 var st = Math.sin(tau * t);
 return [(this.R+this.r*cu)*ct,
	 this.r*su,
	 (this.R+this.r*cu)*st];
};

algtop.torus.normal = function(t,u) {
 var tau = 2 * Math.PI;
 var cu = Math.cos(tau * u);
 var su = Math.sin(tau * u);
 var ct = Math.cos(tau * t);
 var st = Math.sin(tau * t);
 return [cu*ct,su,cu*st];
};

/***********************************************************************/
algtop.cylinder = Object.create(algtop.surface);
algtop.cylinder.name = 'cylinder';
algtop.cylinder.r = 2;
algtop.cylinder.h = 4;

algtop.cylinder.embedding = function(t,u) {
 return [this.r * Math.cos(2 * Math.PI * t),
	 (u - 0.5) * this.h,
	 this.r * Math.sin(2 * Math.PI * t)];
};

algtop.cylinder.normal = function(t,u) {
 return [Math.cos(2 * Math.PI * t),
	 0,
	 Math.sin(2 * Math.PI * t)];
};

/***********************************************************************/
algtop.sphere = Object.create(algtop.surface);
algtop.sphere.name = 'sphere';
algtop.sphere.r = 3;

algtop.sphere.normal = function(t,u) {
 var cu = Math.cos(2 * Math.PI * u);
 var su = Math.sin(2 * Math.PI * u);
 var ct = Math.cos(Math.PI * t);
 var st = Math.sin(Math.PI * t);
 return [st*cu, ct, st*su];
};

algtop.sphere.embedding = function(t,u) {
 var x = this.normal(t,u);
 return [this.r * x[0], this.r * x[1], this.r * x[2]];
};

/***********************************************************************/
algtop.mobius = Object.create(algtop.surface);
algtop.mobius.name = 'mobius';
algtop.mobius.R = 3;
algtop.mobius.r = 1;
algtop.mobius.n = 128;

algtop.mobius.embedding = function(t,u) {
 var c2 = Math.cos(2 * Math.PI * t);
 var s2 = Math.sin(2 * Math.PI * t);
 var c4 = c2 * c2 - s2 * s2;
 var s4 = 2 * c2 * s2;
 return [(this.R + this.r * u * c2) * c4,
	 this.r * u * s2,
	 (this.R + this.r * u * c2) * s4];
};

algtop.mobius.normal = function(t,u) {
 var c = Math.cos(2 * Math.PI * t);
 var s = Math.sin(2 * Math.PI * t);
 var r = this.r;
 var R = this.R;
 var n = [(8*s*t^2-4*s)*r*R+(8*s*t^3-8*s*t)*u*r^2,
	  -4*r^2*t^2*u-4*R*r*t,
	  (-8*t^3+8*t)*r*R+(-8*t^4+12*t^2-2)*u*r^2 ];
 var nn = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
 n = [- n[0] / nn, - n[1] / nn, - n[2] / nn];
 return n;
}

/***********************************************************************/

algtop.boys = Object.create(algtop.surface);

algtop.boys.coeffs =
 [[0.19841, 0, 0, 0.13226, 0.31036, 0, 0, 0.05120, 0.03890],
  [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -0.60213, -0.37851, 0, 0, -0.00688, 0.15039, 0, 0],
  [0.30612, 0, 0, -0.25597, -0.26741, 0, 0, -0.06826, -0.05186],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -0.13195, -0.06075, 0, 0, 0.00344, -0.07520, 0, 0],
  [0.07282, 0, 0, 0.12371, -0.04294, 0, 0, 0.01706, 0.01297]];

algtop.boys.embedding0 = function(t,u) {
 var t0 = Math.PI * t / 2;
 var u0 = Math.PI * u * 2; 
 var Bt = [1,Math.sin(t0),Math.cos(t0),Math.sin(2*t0),Math.cos(2*t0),
	   Math.sin(3*t0),Math.cos(3*t0),Math.sin(4*t0),Math.cos(4*t0)];
 var Bu = [1,Math.sin(u0),Math.cos(u0),Math.sin(2*u0),Math.cos(2*u0),
	   Math.sin(3*u0),Math.cos(3*u0),Math.sin(4*u0),Math.cos(4*u0)];

 var v = 0;
 for (var i = 0; i < 9; i++) {
  for (var j = 0; j < 9; j++) {
   v += this.coeffs[i][j] * Bt[i] * Bu[j];
  }
 }

 return v;
}

algtop.boys.embedding = function(t,u) {
 return [
  this.embedding0(t,u),
  this.embedding0(t,u+1/3),
  this.embedding0(t,u+2/3)
 ];
}

/***********************************************************************/
algtop.klein = Object.create(algtop.surface);
algtop.klein.a = 0.4;
algtop.klein.b = 0.6;
algtop.klein.c = 0.3;
algtop.klein.n = 128;
algtop.klein.m = 32;

algtop.klein.embedding = function(t,u) {
 var cu = Math.cos(2 * Math.PI * u);
 var su = Math.sin(2 * Math.PI * u);
 var c1 = Math.cos(    Math.PI * t);
 var c2 = Math.cos(2 * Math.PI * t);
 var c3 = Math.cos(3 * Math.PI * t);
 var c4 = Math.cos(4 * Math.PI * t);
 var s1 = Math.sin(    Math.PI * t);
 var s2 = Math.sin(2 * Math.PI * t);
 var s3 = Math.sin(3 * Math.PI * t);
 var s4 = Math.sin(4 * Math.PI * t);

 var x = (0.1*s3+0.1*s1+0.4*c1)*su-0.5*s4+s2;
 var y = 0.2*su*s3+2.*c2+0.5;
 var z = 0.25*cu*s2+0.4*cu;
 return [-x,z,y];
}

/***********************************************************************/
algtop.trefoil = Object.create(algtop.surface);
algtop.trefoil.R = 1;
algtop.trefoil.r = 0.1;

algtop.trefoil.frame = function(t0) {
 var t = 2 * Math.PI * t0;
 var sin = Math.sin;
 var cos = Math.cos;
 var x = [sin(t) + 2*sin(2*t),cos(t) - 2 * cos(2*t),-sin(3*t)];
 var y = [72*sin(2*t)+3*sin(8*t)-13*sin(4*t)+3*sin(7*t)-14*sin(5*t)+3*sin(t),
       3*cos(t)-3*cos(8*t)+3*cos(7*t)-72*cos(2*t)+14*cos(5*t)-13*cos(4*t),
       10*sin(6*t)-34*sin(3*t)];
 var z = [-391*cos(t)+2*cos(8*t)-29*cos(7*t)+
	  85*cos(2*t)-99*cos(5*t)+24*cos(4*t)+9*cos(10*t)-9*cos(11*t),
          -9*sin(11*t)+29*sin(7*t)+85*sin(2*t)-9*sin(10*t)+
	  2*sin(8*t)-24*sin(4*t)-99*sin(5*t)+391*sin(t),
          -570-34*cos(3*t)-94*cos(6*t)+18*cos(9*t)];
 var ny = Math.sqrt(y[0]*y[0] + y[1]*y[1] + y[2]*y[2]);
 var nz = Math.sqrt(z[0]*z[0] + z[1]*z[1] + z[2]*z[2]);
 y = [y[0]/ny, y[1]/ny, y[2]/ny];
 z = [z[0]/nz, z[1]/nz, z[2]/nz];

 return {'x' : x, 'y' : y, 'z' : z};
}

algtop.trefoil.embedding = function(t0,u0) {
 var f = this.frame(t0);

 var cu = Math.cos(2 * Math.PI * u0);
 var su = Math.sin(2 * Math.PI * u0);
 return [this.R * f.x[0] + this.r * (cu * f.y[0] + su * f.z[0]),
	 this.R * f.x[1] + this.r * (cu * f.y[1] + su * f.z[1]),
	 this.R * f.x[2] + this.r * (cu * f.y[2] + su * f.z[2])];
}

algtop.trefoil.normal = function(t0,u0) {
 var f = this.frame(t0);

 var cu = Math.cos(2 * Math.PI * u0);
 var su = Math.sin(2 * Math.PI * u0);
 return [(cu * f.y[0] + su * f.z[0]),
	 (cu * f.y[1] + su * f.z[1]),
	 (cu * f.y[2] + su * f.z[2])];
}

/***********************************************************************/

algtop.thick_curve = {};

algtop.thick_curve.n = 48;
algtop.thick_curve.colour = new BABYLON.Color4(1,0,0,1); // red
algtop.thick_curve.radius = 0.03;

/***********************************************************************/

algtop.thin_curve = {};

algtop.thin_curve.n = 48;
algtop.thin_curve.colour = new BABYLON.Color4(1,0,0,1); // red

/***********************************************************************/

algtop.thin_circle = Object.create(algtop.thin_curve);

algtop.thin_circle.c = [0,0,0];
algtop.thin_circle.u = [1,0,0];
algtop.thin_circle.v = [0,1,0];
algtop.thin_circle.embedding = function(t) {
 var ct = Math.cos(2 * Math.PI * t);
 var st = Math.sin(2 * Math.PI * t);
 return [this.c[0] + ct * this.u[0] + st * this.v[0],
	 this.c[1] + ct * this.u[1] + st * this.v[1],
	 this.c[2] + ct * this.u[2] + st * this.v[2]
	];
}

/***********************************************************************/

algtop.triangle = {
 v : [[1,0,0],[0,0,1],[0,1,0]]
};

/***********************************************************************/

algtop.simplex3_embedding = function(t) {
 var u0 = 0.943*t[1]-0.471*t[2]-0.471*t[3];
 var u1 = 0.816*t[2]-0.816*t[3];
 var u2 = t[0]-0.333*t[1]-0.333*t[2]-0.333*t[3];
 var u = [u0,u2,u1];
 return u;
}

/***********************************************************************/
algtop.basic_scene = function(engine,canvas) {
 var scene = new BABYLON.Scene(engine);
 scene.clearColor = BABYLON.Color3.White();
 
 var light = new BABYLON.HemisphericLight("light0", new BABYLON.Vector3(-1, 1, 0), scene);
 light.diffuse     = new BABYLON.Color3(0.6, 0.4, 0.4);
 light.specular    = new BABYLON.Color3(0.2, 0.5, 0.4);
 light.groundColor = new BABYLON.Color3(0.6, 0.7, 0.8);

 var camera = new BABYLON.ArcRotateCamera("camera1",  0, 1.2, 10, new BABYLON.Vector3(0, 0, 0), scene);
 camera.attachControl(canvas, true);
 camera.wheelPrecision = 50;

 scene.camera = camera;
 return scene;
};

algtop.set_colour = function(mesh,r,g,b) {
 var mat = new BABYLON.StandardMaterial("mat", mesh.getScene());
 mat.backFaceCulling = false;
 mat.diffuseColor  = new BABYLON.Color3(r,g,b);
 mesh.material = mat;
 mesh.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
}

algtop.make_grid_with_normal = function(n,m,f,g) {
 var i,j,t,u,x,positions,indices,normals,grid;
 
 positions = [];
 indices = [];
 normals = [];
 
 for (i = 0; i <= n; i++) {
  for (j = 0; j <= m; j++) {
   t = (i * 1.)/n;
   u = (j * 1.)/m;
   x = f(t,u);
   positions.push(x[0],x[1],x[2]);
   if (g) {
    v = g(t,u);
    normals.push(v[0],v[1],v[2]);
   }
   if (i < n && j < m) {
    i1 = (i + 1);
    j1 = (j + 1);
    k0 = (m + 1) * i  + j;
    k1 = (m + 1) * i1 + j;
    k2 = (m + 1) * i  + j1;
    k3 = (m + 1) * i1 + j1;
    indices.push(k0,k1,k3,k0,k3,k2);
//    indices.push(k0,k3,k1,k0,k2,k3);
   }
  }
 }

 if (!g) {
  BABYLON.VertexData.ComputeNormals(positions, indices, normals);
 }
 
 var grid = new BABYLON.VertexData();
 grid.positions = positions;
 grid.normals   = normals;
 grid.indices   = indices;

 return grid;
}

algtop.make_grid = function(n,m,f) {
 return this.make_grid_with_normal(n,m,f,null);
}

/***********************************************************************/

algtop.surface.make_mesh = function(scene) {
 var f,g,i,j,t,u,c;
 var me = this;

 f = function(t,u) { return me.embedding(t,u); };
 if (this.normal) {
  g = function(t,u) { return me.normal(t,u); };
 } else {
  g = null;
 }

 this.scene = scene;
 this.mesh = new BABYLON.Mesh(this.name, scene);
 if (! this.normal) { this.normal = null; }
 this.grid = 
  algtop.make_grid_with_normal(this.n,this.m,f,g);

 this.grid.applyToMesh(this.mesh,true);

 if (this.colour_function) {
  this.cols = [];
  for (i = 0; i <= this.n; i++) {
   for (j = 0; j <= this.m; j++) {
    t = (i * 1.)/this.n;
    u = (j * 1.)/this.m;
    c = this.colour_function(t,u);
    this.cols.push(c[0],c[1],c[2],c[3]);
   }
  }
  this.mesh.hasVertexAlpha = true;
  this.mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, this.cols);
 } else {
  algtop.set_colour(this.mesh,this.colour.r,this.colour.g,this.colour.b);
 }
}

/***********************************************************************/

algtop.surface.update_mesh = function() {
 var f,g;
 var me = this;

 f = function(t,u) { return me.embedding(t,u); };
 if (this.normal) {
  g = function(t,u) { return me.normal(t,u); };
 } else {
  g = null;
 }

 this.grid = algtop.make_grid_with_normal(this.n,this.m,f,g);
 this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this.grid.positions);
 this.mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, this.grid.normals);
}

/***********************************************************************/

algtop.thick_curve.make_mesh = function(scene) {
 var f,i,x,y,mat;
 var me = this;

 this.scene = scene;

 f = function(t) { return me.embedding(t); };

 positions = [];
 for (i = 0; i <= this.n; i++) {
  x = f((i * 1.)/this.n);
  y = new BABYLON.Vector3(x[0],x[1],x[2]);
  positions.push(y);
 }

 this.mesh = BABYLON.MeshBuilder.CreateTube(
  this.name, {path: positions, radius: this.radius, updateable: true}, scene);

 mat = new BABYLON.StandardMaterial("mat", scene);
 mat.diffuseColor  = this.colour;
 this.mesh.material = mat;
}

/***********************************************************************/

algtop.thick_curve.update_mesh = function(scene) {
 var f,i,x,y,positions;
 var me = this;

 f = function(t) { return me.embedding(t); };

 positions = [];
 for (i = 0; i <= this.n; i++) {
  x = f((i * 1.)/this.n);
  y = new BABYLON.Vector3(x[0],x[1],x[2]);
  positions.push(y);
 }

 this.mesh.dispose();
 this.mesh = BABYLON.MeshBuilder.CreateTube(
  this.name, {path: positions, radius: this.radius},scene);
 mat = new BABYLON.StandardMaterial("mat", scene);
 mat.diffuseColor  = this.colour;
 this.mesh.material = mat;
}

/***********************************************************************/

algtop.thin_curve.make_mesh = function(scene) {
 var f,i,x,y,mat;
 var me = this;

 this.scene = scene;

 f = function(t) { return me.embedding(t); };

 this.positions = [];
 for (i = 0; i <= this.n; i++) {
  x = f((i * 1.)/this.n);
  y = new BABYLON.Vector3(x[0],x[1],x[2]);
  this.positions.push(y);
 }

 this.cols = Array(this.positions.length).fill(this.colour);
 this.mesh = BABYLON.MeshBuilder.CreateLines(null,
     {points : this.positions, colors : this.cols, alpha : 1, updatable : true}, scene);

}

/***********************************************************************/

algtop.triangle.make_mesh = function(scene) {
 this.scene = scene;
 var grid = new BABYLON.VertexData();
 grid.positions = algtop.flat(this.v);
 grid.indices = [0,1,2];
 this.mesh = new BABYLON.Mesh(this.name,scene);
 grid.applyToMesh(this.mesh);
}

/***********************************************************************/

algtop.svg = {};

algtop.svg.node = function (t) {
 return document.createElementNS('http://www.w3.org/2000/svg', t);
};

algtop.svg.group = function () {
 return this.node('g');
};

algtop.svg.line = function (x1, y1, x2, y2, color, thickness) {
 var n = this.node('line');
 n.setAttribute('x1', x1);
 n.setAttribute('y1', y1);
 n.setAttribute('x2', x2);
 n.setAttribute('y2', y2);
 n.setAttribute('stroke', color);
 n.setAttribute('stroke-width', thickness);
 n.setAttribute('fill', 'none');
 return n;
};

algtop.svg.hline = function (x1, x2, y, color, thickness) {
 return this.line(x1, y, x2, y, color, thickness);
};

algtop.svg.vline = function (x, y1, y2, color, thickness) {
 return this.line(x, y1, x, y2, color, thickness);
};

algtop.svg.rect = function(x0,y0,w,h,color,thickness) {
 var n = this.node('rect');
 n.setAttribute('x', x0);
 n.setAttribute('y', y0);
 n.setAttribute('width', w);
 n.setAttribute('height', h);
 n.setAttribute('stroke',color);
 n.setAttribute('stroke-width', thickness);
 n.setAttribute('fill', 'none');
 return n
};

algtop.svg.frect = function(x0,y0,w,h,color) {
 var n = this.node('rect');
 n.setAttribute('x', x0);
 n.setAttribute('y', y0);
 n.setAttribute('width', w);
 n.setAttribute('height', h);
 n.setAttribute('stroke','none');
 n.setAttribute('fill', color);
 return n
};

algtop.svg.points_string = function(points) {
 var n,i,m,u,s,point_strings;

 point_strings = [];
 for (i in points) {
  u = points[i];
  if (Array.isArray(u)) {
   point_strings.push('' + u[0] + ',' + u[1]);
  } else {
   point_strings.push('' + u.x + ',' + u.y);   
  }
 }

 s = 'M ' + point_strings[0] + ' L ';
 for (i = 1; i < point_strings.length; i++) {
  s += point_strings[i] + ' ';
 }

 return s;
};

algtop.svg.lines = function(points,color,thickness) {
 var n,i,m,u,s,point_strings;
 n = this.node('path');
 n.setAttribute('stroke',color);
 n.setAttribute('stroke-width',thickness);
 n.setAttribute('fill','none');

 s = this.points_string(points);
 n.setAttribute('d',s);

 return n;
};

algtop.svg.polygon = function(points,color) {
 var n,i,m,u,s,point_strings;
 n = this.node('path');
 n.setAttribute('stroke','none');
 n.setAttribute('fill',color);

 m = points.length;
 s = this.points_string(points);
 n.setAttribute('d',s);

 return n;
};

algtop.svg.circle = function(x0,y0,r,color,thickness) {
 var n = this.node('circle');
 n.setAttribute('cx', x0);
 n.setAttribute('cy', y0);
 n.setAttribute('r', r);
 n.setAttribute('stroke', color);
 n.setAttribute('stroke-width',thickness);
 n.setAttribute('fill', 'none');
 return n
};

algtop.svg.disc = function(x0,y0,r,color) {
 var n = this.node('circle');
 n.setAttribute('cx', x0);
 n.setAttribute('cy', y0);
 n.setAttribute('r', r);
 n.setAttribute('stroke','none');
 n.setAttribute('fill', color);
 return n
};

algtop.svg.text = function(s,x,y) {
 var n = this.node('text');
 n.setAttribute('text-anchor','middle');
 n.setAttribute('alignment-baseline','middle');
 n.setAttribute('font-size','24px');
 n.setAttribute('fill','black');
 n.setAttribute('x', x);
 n.setAttribute('y', y);
 n.textContent = s;
 return n; 
};

algtop.svg.append_tspan = function(t,s) {
 var u = this.node('tspan');
 u.textContent = s;
 t.appendChild(u);
 return u;
}
