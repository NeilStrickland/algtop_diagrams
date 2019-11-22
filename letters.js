algtop.letter = {
 n : 64
};

algtop.letters = {};

algtop.letter.alphabet_list =
 [["A","B","C","D","E"],
  ["F","G","H","I","J"],
  ["K","L","M","N","O"],
  ["P","Q","R","S","T"],
  ["U","V","W","X","Y"]];

algtop.letter.alphabet_type_list = [
 ["C","G","L","M","N","S","U","V","W"],
 ["E","F","J","T","Y"],
 ["H","I"],
 ["K","X"],
 ["O","D","A","Q"],
 ["B"]
];

algtop.letter.pol = function(r,t) {
 return [r * Math.cos(Math.PI*t),
         r * Math.sin(Math.PI*t)];
};

algtop.letter.rot = function(t,x) {
 return [Math.cos(Math.PI*t)*x[0] - Math.sin(Math.PI*t)*x[1],
	 Math.sin(Math.PI*t)*x[0] + Math.cos(Math.PI*t)*x[1]];
};

algtop.letter.add2 = function(x,y) {
 return [x[0] + y[0], x[1] + y[1]];
}

algtop.letter.mul2 = function(x,y) {
 return [x[0] * y[0], x[1] * y[1]];
}

algtop.letter.mul12 = function(x,y) {
 return [x * y[0], x * y[1]];
}

algtop.letter.set_map = function(T) {
 var P,e,s,t;
 T.map = {};
 P = T.embedding;
 for (i in T.max_simplices) {
  e = T.max_simplices[i];
  if (! T.map[e[0]]) { T.map[e[0]] = {}; }
  algtop.letter.set_one_map(T,e[0],e[1],P[e[0]],P[e[1]]);
 }
}

algtop.letter.set_one_map = function(T,i,j,p,q) {
 T.map[i][j] = function(t) {
  return [(1-t) * p[0] + t * q[0], (1-t) * p[1] + t * q[1]];
 }
}

algtop.letter.set_alt_map = function(T) {
 var P,e,s,t;
 T.alt_map = {};
 P = T.alt_embedding;
 for (i in T.max_simplices) {
  e = T.max_simplices[i];
  if (! T.alt_map[e[0]]) { T.alt_map[e[0]] = {}; }
  algtop.letter.set_one_alt_map(T,e[0],e[1],P[e[0]],P[e[1]]);
 }
}

algtop.letter.set_one_alt_map = function(T,i,j,p,q) {
 T.alt_map[i][j] = function(t) {
  return [(1-t) * p[0] + t * q[0], (1-t) * p[1] + t * q[1]];
 }
}

algtop.letter.set_isotopy = function(T) {
 var P,e,p,q;
 T.isotopy = {};
 P = T.map;
 Q = T.alt_map;
 for (i in T.max_simplices) {
  e = T.max_simplices[i];
  if (! T.isotopy[e[0]]) { T.isotopy[e[0]] = {}; }
  p = P[e[0]][e[1]];
  q = Q[e[0]][e[1]];
  algtop.letter.set_one_isotopy(T,e[0],e[1],p,q);
 }
}

algtop.letter.set_one_isotopy = function(T,i,j,p,q) {
 T.isotopy[i][j] = function(s,t) {
  return [(1-s) * p(t)[0] + s * q(t)[0],
	  (1-s) * p(t)[1] + s * q(t)[1]];
 }
}

algtop.letter.rotate_isotopy = function(T,a) {
 var P0,P1,P2,e,v,s,t;
 P0 = T.alt_embedding;
 P1 = T.alt_map;
 P2 = T.isotopy;
 T.alt_embedding = {};
 T.alt_map = {};
 T.isotopy = {};
 for (i in T.vertices) {
  v = T.vertices[i];
  T.alt_embedding[v] = algtop.letter.rot(a,P0[v]);
 }
 for (i in T.max_simplices) {
  e = T.max_simplices[i];
  algtop.letter.rotate_one_isotopy(T,a,e[0],e[1],P1[e[0]][e[1]],P2[e[0]][e[1]]);
 }
}

algtop.letter.rotate_one_isotopy = function(T,a,i,j,p,q) {
 if (! T.alt_map[i]) { T.alt_map[i] = {}; }
 if (! T.isotopy[i]) { T.isotopy[i] = {}; }
 
 T.alt_map[i][j] = function(t) {
  return algtop.letter.rot(a,p(t));
 };
 
 T.isotopy[i][j] = function(s,t) {
  return algtop.letter.rot(a*s,q(s,t));
 };
}

algtop.letter.translate_letter = function(T,a) {
 var P0,P1,P2,P3,P4,e,v,s,t;
 P0 = eval(T.embedding);
 P1 = eval(T.map);
 P2 = eval(T.alt_embedding);
 P3 = eval(T.alt_map);
 P4 = eval(T.isotopy);
 T.embedding = {};
 T.map = {};
 T.alt_embedding = {};
 T.alt_map = {};
 T.isotopy = {};
 for (i in T.vertices) {
  v = T.vertices[i];
  T.embedding[v] = [P0[v][0] + a[0],P0[v][1] + a[1]];
  T.alt_embedding[v] = [P3[v][0] + a[0],P3[v][1] + a[1]];
 }
 for (i in T.max_simplices) {
  e = T.max_simplices[i];
  algtop.letter.translate_one_isotopy(T,a,e[0],e[1],
   P1[e[0]][e[1]],P3[e[0]][e[1]],P2[e[0]][e[1]]);
 }
}

algtop.letter.translate_one_isotopy = function(T,a,i,j,p,q,r) {

}

algtop.letter.create_svg = function() {
 var g,i,j,k,e;
 
 g = algtop.svg.group();
 this.group = g;
 this.points = {};
 this.paths = {};
 
 for (i in this.max_simplices) {
  e = this.max_simplices[i];
  this.points[i] = {};
  this.paths[i] = {};
  for (j = 0; j <= this.n; j++) {
   this.points[i][j] = [];
   for (k = 0; k <= this.n; k++) {
    this.points[i][j].push(this.isotopy[e[0]][e[1]](j/this.n,k/this.n));
   }
   this.paths[i][j] = algtop.svg.lines(this.points[i][j],'black',0.02);
   this.paths[i][j].setAttribute('visibility',j == 0 ? 'visible' : 'hidden');
   g.appendChild(this.paths[i][j]);
  }
 }

 return g;
}

algtop.letter.set_stage = function(k) {
 var k0 = k % (this.n + 1);

 for (i in this.paths) {
  var p = this.paths[i];
  for (j = 0; j <= this.n; j++) {
   p[j].setAttribute('visibility',j == k0 ? 'visible' : 'hidden');
  }
 }
}

/***********************************************************************/
// E

T = Object.create(algtop.letter);
T.letter = 'E';
T.vertices = [1,2,3,4,5,6];
T.max_simplices = [[1,2],[2,3],[3,4],[4,5],[3,6]];
T.embedding_dim = 2;
T.embedding = {
 1 : [0.5,-1], 2 : [-0.5,-1], 3 : [-0.5,0], 4 : [-0.5,1], 5 : [0.5,1], 6 : [0,0]
};
T.alt_embedding = {
 1 : [-1,-1], 2 : [-1,-0.5], 3 : [-1,0], 4 : [-1,0.5], 5 : [-1,1], 6 : [1,0]
};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
T["isotopy"][1][2] = function(s,t) {
 return algtop.letter.add2(
  algtop.letter.mul12((1-s) , [-0.5,-1]),
  algtop.letter.add2(
   algtop.letter.mul12(s,[-1,-0.5]),
   algtop.letter.pol((1-0.5*s)*(1-t),-s/2)));
};
T["isotopy"][4][5] = function(s,t) {
 return algtop.letter.add2(
  algtop.letter.mul12((1-s), [-0.5, 1]),
  algtop.letter.add2(
   algtop.letter.mul12(s, [-1, 0.5]),
   algtop.letter.pol((1-0.5*s)*(1-t), s/2)));
};
algtop.letter.rotate_isotopy(T,-0.5);
algtop.letters["E"] = T;



/***********************************************************************/
// A

T = Object.create(algtop.letter);
T.letter = 'A';
T.vertices = [1,2,3,4,5];
T.max_simplices = [[1,2],[2,3],[3,4],[4,5],[2,4]];
T.embedding_dim = 2;
T.embedding = {
 1 : [-1,-1], 2 : [-0.5,0], 3 : [0,1], 4 : [0.5,0], 5 : [1,-1]
};
T.alt_embedding = {
 1 : [-1.5,0], 2 : [-1,0], 3 : [0,1], 4 : [1,0], 5 : [1.5,0]
};
algtop.letter.set_map(T); 
algtop.letter.set_alt_map(T);
T.alt_map[2][3] = function(t) { return [-Math.cos(Math.PI/2*t),Math.sin(Math.PI/2*t)]; };
T.alt_map[3][4] = function(t) { return [ Math.sin(Math.PI/2*t),Math.cos(Math.PI/2*t)]; };
T.alt_map[2][4] = function(t) { return [-Math.cos(Math.PI*t),-Math.sin(Math.PI*t)]; };
algtop.letter.set_isotopy(T);
algtop.letters["A"] = T;

/***********************************************************************/
// B

T = Object.create(algtop.letter);
T.letter = 'B';
T.vertices = [1,2,3,4,5,6];
T.max_simplices = [[1,2],[1,4],[2,3],[2,5],[3,6],[4,5],[5,6]];
T.embedding_dim = 2;
T.embedding = {
 1 : [-0.5,-1],
 2 : [-0.5,0],
 3 : [-0.5,1],
 4 : [0,-1],
 5 : [0,0],
 6 : [0,1]
};
T.alt_embedding = {
 1 : algtop.letter.pol(1,-2/3),
 2 : algtop.letter.pol(1,1),
 3 : algtop.letter.pol(1,2/3),
 4 : algtop.letter.pol(1,-1/3),
 5 : algtop.letter.pol(1,0),
 6 : algtop.letter.pol(1,1/3)
};
algtop.letter.set_map(T); 
algtop.letter.set_alt_map(T);
T.map[4][5] = function(t) { return [algtop.letter.pol(0.5,t-0.5)[0],algtop.letter.pol(0.5,t-0.5)[1]-0.5]; }
T.map[5][6] = function(t) { return [algtop.letter.pol(0.5,t-0.5)[0],algtop.letter.pol(0.5,t-0.5)[1]+0.5]; }
T.alt_map[1][2] = function(t) { return algtop.letter.pol(1,(-2-t)/3); };
T.alt_map[1][4] = function(t) { return algtop.letter.pol(1,(-2+t)/3); };
T.alt_map[2][3] = function(t) { return algtop.letter.pol(1,(-3-t)/3); };
T.alt_map[3][6] = function(t) { return algtop.letter.pol(1,( 2-t)/3); };
T.alt_map[4][5] = function(t) { return algtop.letter.pol(1,(-1+t)/3); };
T.alt_map[5][6] = function(t) { return algtop.letter.pol(1,(   t)/3); };
algtop.letter.set_isotopy(T);
algtop.letters["B"] = T;

/***********************************************************************/
// C

T = Object.create(algtop.letter);
T.letter = 'C';
T.vertices = [1,2];
T.max_simplices = [[1,2]];
T.embedding_dim = 2;
T.embedding = {1 : algtop.letter.mul2(algtop.letter.pol(1,0.4), [0.8,1]), 2 : algtop.letter.mul2(algtop.letter.pol(1,-0.4), [0.8,1])};
T.alt_embedding = {1 : [0,1], 2: [0,-1]};
T.map = {1 : { 2 : function(t) { return algtop.letter.mul2(algtop.letter.pol(1,0.4 + 1.2*t),[0.8,1]); }}};
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letters["C"] = T;

/***********************************************************************/
// D

T = Object.create(algtop.letter);
T.letter = 'D';
T.vertices = [1,2,3];
T.max_simplices = [[1,2],[1,3],[2,3]];
T.embedding_dim = 2;
T.embedding = {1 : [-0.5,-1], 2: [-0.5,1], 3 : [0.5,0]};
T.alt_embedding = {1 : [0,-1], 2: [0,1], 3 : [1,0]};
algtop.letter.set_map(T);
T.map[1][3] = function(t) { return algtop.letter.add2([-0.5,0], algtop.letter.pol(1,-0.5 + 0.5*t)); };
T.map[2][3] = function(t) { return algtop.letter.add2([-0.5,0], algtop.letter.pol(1, 0.5 - 0.5*t)); };
T.alt_map = {1 : {}, 2 : {}};
T.alt_map[1][2] = function(t) { return algtop.letter.pol(1,-0.5 - t); };
T.alt_map[1][3] = function(t) { return algtop.letter.pol(1,-0.5 + 0.5*t); };
T.alt_map[2][3] = function(t) { return algtop.letter.pol(1, 0.5 - 0.5*t); };
algtop.letter.set_isotopy(T);
algtop.letters["D"] = T;

/***********************************************************************/
// F

T = Object.create(algtop.letter);
T.letter = 'F';
T.vertices = [1,2,3,4,5];
T.max_simplices = [[1,2],[2,3],[3,4],[2,5]];
T.embedding_dim = 2;
T.embedding = {
 1 : [-0.5,-1], 2 : [-0.5,0], 3 : [-0.5,1], 4 : [0.5,1], 5 : [0,0]
};
T.alt_embedding = {
 1 : [-1,-1], 2 : [-1,0], 3 : [-1,0.5], 4 : [-1,1], 5 : [1,0]
};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
T["isotopy"][[3,4]] = function(s,t) {
 return algtop.letter.add2(algtop.letter.mul12((1-s), [-0.5, 1]), algtop.letter.add2(algtop.letter.mul12(s, [-1, 0.5]), algtop.letter.pol((1-0.5*s)*(1-t), s/2)));
};
algtop.letter.rotate_isotopy(T,-0.5);
algtop.letters["F"] = T;

/***********************************************************************/
// G

T = Object.create(algtop.letter);
T.letter = 'G';
T.vertices = [1,2,3];
T.max_simplices = [[1,2],[2,3]];
T.embedding_dim = 2;
T.embedding = {1 : algtop.letter.mul2(algtop.letter.pol(1,0.4), [0.8,1]),
	       2 : algtop.letter.mul2(algtop.letter.pol(1,-0.4), [0.8,1]),
               3 : algtop.letter.add2(algtop.letter.mul2(algtop.letter.pol(1,-0.4), [0.8,1]), [0,-0.4])};
T.alt_embedding = {1 : [0,1], 2: [0,0], 3: [0,-1]};
algtop.letter.set_map(T);
T.map[1][2] = function(t) { return algtop.letter.mul2(algtop.letter.pol(1,0.4 + 1.2*t), [0.8,1]); };
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letters["G"] = T;

/***********************************************************************/
// H

T = Object.create(algtop.letter);
T.letter = 'H';
T.vertices = [1,2,3,4,5,6];
T.max_simplices = [[1,2],[2,3],[2,5],[4,5],[5,6]];
T.embedding_dim = 2;
T.embedding = {1: [-0.5,-1],
	       2: [-0.5,0],
	       3: [-0.5,1],
               4: [ 0.5,-1],
	       5: [ 0.5,0],
	       6: [ 0.5,1]
              };
T.alt_embedding = {1 : [-1,-1], 2: [-1,0], 3: [-1,1],
                   4: [1,-1],5: [1,0],6: [1,1]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letter.rotate_isotopy(T,-0.5);
algtop.letters["H"] = T;

/***********************************************************************/
// I

T = Object.create(algtop.letter);
T.letter = 'I';
T.vertices = [1,2,3,4,5,6];
T.max_simplices = [[1,2],[2,3],[2,5],[4,5],[5,6]];
T.embedding_dim = 2;
T.embedding = {1: [-0.2,-1],2: [0,-1],3: [0.2,-1],
                         4: [-0.2,1],5: [0,1],6: [0.2,1]
              };
T.alt_embedding = {1 : [-1,-1], 2: [0,-1], 3: [1,-1],
                   4: [-1,1],5: [0,1],6: [1,1]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letters["I"] = T;

/***********************************************************************/
// J

T = Object.create(algtop.letter);
T.letter = 'J';
T.vertices = [1,2,3,4,5];
T.max_simplices = [[1,2],[2,4],[3,4],[4,5]];
T.embedding_dim = 2;
T.embedding = {1: [-0.6,-0.7],2: [0,-0.7],3: [-0.5,1],
                         4: [0,1],5: [0.5,1]
              };
T.alt_embedding = {1 : [0,-1], 2: [0,0], 3: [-1,1],
                   4: [0,1],5: [1,1]};
algtop.letter.set_map(T);
T.map[1][2] = function(t) { return algtop.letter.add2([-0.3,-0.7], algtop.letter.pol(0.3,-1+t)); };
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letters["J"] = T;

/***********************************************************************/
// K

T = Object.create(algtop.letter);
T.letter = 'K';
T.vertices = [1,2,3,4,5];
T.max_simplices = [[1,2],[2,3],[2,4],[2,5]];
T.embedding_dim = 2;
T.embedding = {1: [-0.5,-1],2: [-0.5,0],3: [-0.5,1],
                         4: [0.5,-1],5: [0.5,1]
              };
T.alt_embedding = {1 : [-1,-1], 2: [0,0], 3: [-1,1],
                   4: [1,-1],5: [1,1]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letters["K"] = T;

/***********************************************************************/
// L

T = Object.create(algtop.letter);
T.letter = 'L';
T.vertices = [1,2,3];
T.max_simplices = [[1,2],[2,3]];
T.embedding_dim = 2;
T.embedding = {1: [0.5,-1],2: [-0.5,-1],3: [-0.5,1]};
T.alt_embedding = {1 : [0,-1], 2: [0,0], 3: [0,1]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letters["L"] = T;

/***********************************************************************/
// M

T = Object.create(algtop.letter);
T.letter = 'M';
T.vertices = [1,2,3,4,5];
T.max_simplices = [[1,2],[2,3],[3,4],[4,5]];
T.embedding_dim = 2;
T.embedding = {1: [-0.6,-1],2: [-0.3,1],3: [0,-1],4: [0.3,1],5: [0.6,-1]};
T.alt_embedding = {1 : [-1,0], 2: [-0.5,0], 3: [0,0],4: [0.4,0],5: [1,0]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letter.rotate_isotopy(T,-0.5);
algtop.letters["M"] = T;

/***********************************************************************/
// N

T = Object.create(algtop.letter);
T.letter = 'N';
T.vertices = [1,2,3,4];
T.max_simplices = [[1,2],[2,3],[3,4]];
T.embedding_dim = 2;
T.embedding = {1: [-0.5,-1],2: [-0.5,1],3: [0.5,-1],4: [0.5,1]};
T.alt_embedding = {1 : [-1,0], 2: [-0.33,0], 3: [0.33,0],4: [1,0]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letter.rotate_isotopy(T,-0.5);
algtop.letters["N"] = T;

/***********************************************************************/
// O

T = Object.create(algtop.letter);
T.letter = 'O';
T.vertices = [1,2,3,4];
T.max_simplices = [[1,2],[2,3],[3,4],[1,4]];
T.embedding_dim = 2;
T.embedding = {
 1 : algtop.letter.mul2(algtop.letter.pol(1,0.0) , [0.6,1]),
 2 : algtop.letter.mul2(algtop.letter.pol(1,0.5) , [0.6,1]),
 3 : algtop.letter.mul2(algtop.letter.pol(1,1.0) , [0.6,1]),
 4 : algtop.letter.mul2(algtop.letter.pol(1,1.5) , [0.6,1])
};
T.alt_embedding = {1 : algtop.letter.pol(1,0),2 : algtop.letter.pol(1,0.5),3 : algtop.letter.pol(1,1),4 : algtop.letter.pol(1,1.5)};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
T.map[1][2] = function(t) { return algtop.letter.mul2(algtop.letter.pol(1,0.5* t   ) , [0.6,1]); };
T.map[2][3] = function(t) { return algtop.letter.mul2(algtop.letter.pol(1,0.5*(t+1)) , [0.6,1]); };
T.map[3][4] = function(t) { return algtop.letter.mul2(algtop.letter.pol(1,0.5*(t+2)) , [0.6,1]); };
T.map[1][4] = function(t) { return algtop.letter.mul2(algtop.letter.pol(1,0.5*(4-t)) , [0.6,1]); };
T.alt_map[1][2] = function(t) { return algtop.letter.pol(1,0.5* t   ); };
T.alt_map[2][3] = function(t) { return algtop.letter.pol(1,0.5*(t+1)); };
T.alt_map[3][4] = function(t) { return algtop.letter.pol(1,0.5*(t+2)); };
T.alt_map[1][4] = function(t) { return algtop.letter.pol(1,0.5*(4-t)); };
algtop.letter.set_isotopy(T);
algtop.letters["O"] = T;

/***********************************************************************/
// P

T = Object.create(algtop.letter);
T.letter = 'P';
T.vertices = [1,2,3,4];
T.max_simplices = [[1,2],[2,3],[3,4],[2,4]];
T.embedding_dim = 2;
T.embedding = {1: [-0.25,-1],2: [-0.25,0],3: [-0.25,1],4: [0.5,0.5]};
T.alt_embedding = {1: [0,-1.5],2: [0,-1],3:algtop.letter.pol(1,2/3),4 : algtop.letter.pol(1,1/3)};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
T.map[2][4] = function(t) { return algtop.letter.add2(algtop.letter.mul2(algtop.letter.pol(0.5,0.5*(t-1)) , [1.5,1]) , [-0.25,0.5]); };
T.map[3][4] = function(t) { return algtop.letter.add2(algtop.letter.mul2(algtop.letter.pol(0.5,0.5*(1-t)) , [1.5,1]) , [-0.25,0.5]); };
T.alt_map[2][3] = function(t) { return algtop.letter.pol(1,-1/2-2/3*t); };
T.alt_map[2][4] = function(t) { return algtop.letter.pol(1,-1/2+2/3*t); };
T.alt_map[3][4] = function(t) { return algtop.letter.pol(1,5/6-2/3*t); };
algtop.letter.set_isotopy(T);
algtop.letter.rotate_isotopy(T,0.5);
algtop.letters["P"] = T;

/***********************************************************************/
// Q

T = Object.create(algtop.letter);
T.letter = 'Q';
T.vertices = [1,2,3,4,5];
T.max_simplices = [[1,2],[2,3],[1,3],[1,4],[1,5]];
T.embedding_dim = 2;
T.embedding = {
 1: algtop.letter.mul2(algtop.letter.pol(1,-1/4)   , [0.6,1]),
 2: algtop.letter.mul2(algtop.letter.pol(1,5/12)   , [0.6,1]),
 3: algtop.letter.mul2(algtop.letter.pol(1,13/12)  , [0.6,1]),
 4: algtop.letter.mul2(algtop.letter.pol(1.3,-1/4) , [0.6,1]),
 5: algtop.letter.mul2(algtop.letter.pol(0.7,-1/4) , [0.6,1])
};
T.alt_embedding = {
 1: algtop.letter.pol(1,-1/4),
 2: algtop.letter.pol(1,5/12),
 3: algtop.letter.pol(1,13/12),
 4: algtop.letter.pol(1.5,-1/4),
 5: algtop.letter.pol(0.5,-1/4)
};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
T.map[1][2] = function(t) { return algtop.letter.mul2(algtop.letter.pol(1,-1/4+2/3*t) , [0.6,1]); };
T.map[1][3] = function(t) { return algtop.letter.mul2(algtop.letter.pol(1,-1/4-2/3*t) , [0.6,1]); };
T.map[2][3] = function(t) { return algtop.letter.mul2(algtop.letter.pol(1,5/12+2/3*t) , [0.6,1]); };
T.alt_map[1][2] = function(t) { return algtop.letter.pol(1,-1/4+2/3*t); };
T.alt_map[1][3] = function(t) { return algtop.letter.pol(1,-1/4-2/3*t); };
T.alt_map[2][3] = function(t) { return algtop.letter.pol(1,5/12+2/3*t); };
algtop.letter.set_isotopy(T);
algtop.letter.rotate_isotopy(T,0.25);
algtop.letters["Q"] = T;

/***********************************************************************/
// R

T = Object.create(algtop.letter);
T.letter = 'R';
T.vertices = [1,2,3,4,5];
T.max_simplices = [[1,2],[2,3],[3,4],[2,4],[2,5]];
T.embedding_dim = 2;
T.embedding = {1: [-0.25,-1],2: [-0.25,0],3: [-0.25,1],4: [0.5,0.5],5: [0.5,-1]};
T.alt_embedding = {1: [-0.5,-1.5],2: [0,-1],3:algtop.letter.pol(1,2/3),4 : algtop.letter.pol(1,1/3),5 : [0.5,-1.5]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
T.map[2][4] = function(t) { return algtop.letter.add2(algtop.letter.mul2(algtop.letter.pol(0.5,0.5*(t-1)) , [1.5,1]) , [-0.25,0.5]); };
T.map[3][4] = function(t) { return algtop.letter.add2(algtop.letter.mul2(algtop.letter.pol(0.5,0.5*(1-t)) , [1.5,1]) , [-0.25,0.5]); };
T.alt_map[2][3] = function(t) { return algtop.letter.pol(1,-1/2-2/3*t); };
T.alt_map[2][4] = function(t) { return algtop.letter.pol(1,-1/2+2/3*t); };
T.alt_map[3][4] = function(t) { return algtop.letter.pol(1,5/6-2/3*t); };
algtop.letter.set_isotopy(T);
algtop.letter.rotate_isotopy(T,0.5);
algtop.letters["R"] = T;

/***********************************************************************/
// S

T = Object.create(algtop.letter);
T.letter = 'S';
T.vertices = [1,2,3];
T.max_simplices = [[1,2],[2,3]];
T.embedding_dim = 2;
theta = -0.05;
T.embedding = {
 1 : algtop.letter.rot(theta,algtop.letter.add2([0,-0.5] , algtop.letter.pol(0.5,-0.3))),
 2 : [0,0],
 3 : algtop.letter.rot(theta,algtop.letter.add2([0, 0.5] , algtop.letter.pol(0.5,0.3)))};
T.alt_embedding = {1: [0,-1],2: [0,0],3: [0,1]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
T.map[1][2] = function(t) { return algtop.letter.rot(theta,algtop.letter.add2([0,-0.5] , algtop.letter.pol(0.5,-0.7+1.2*t))); };
T.map[2][3] = function(t) { return algtop.letter.rot(theta,algtop.letter.add2([0, 0.5] , algtop.letter.pol(0.5,-0.5-1.2*t))); };
algtop.letter.set_isotopy(T);
algtop.letters["S"] = T;

/***********************************************************************/
// T

T = Object.create(algtop.letter);
T.letter = 'T';
T.vertices = [1,2,3,4];
T.max_simplices = [[1,2],[2,3],[2,4]];
T.embedding_dim = 2;
T.embedding = {1: [0,-1],2: [0,1],3: [-0.7,1],4: [0.7,1]};
T.alt_embedding = {1 : [0,-1], 2: [0,1], 3: [-1,1],4: [1,1]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letters["T"] = T;

/***********************************************************************/
// U

T = Object.create(algtop.letter);
T.letter = 'U';
T.vertices = [1,2,3,4];
T.max_simplices = [[1,2],[2,3],[3,4]];
T.embedding_dim = 2;
T.embedding = {1: [-0.6,1],2: [-0.6,-0.4],3: [0.6,-0.4],4: [0.6,1]};
T.alt_embedding = {1 : [-1,0], 2: [-0.33,0], 3: [0.33,0],4: [1,0]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
T.map[2][3] = function(t) { return algtop.letter.add2([0,-0.4], algtop.letter.pol(0.6,t-1)); };
algtop.letter.set_isotopy(T);
algtop.letter.rotate_isotopy(T,-0.5);
algtop.letters["U"] = T;

/***********************************************************************/
// V

T = Object.create(algtop.letter);
T.letter = 'V';
T.vertices = [1,2,3];
T.max_simplices = [[1,2],[2,3]];
T.embedding_dim = 2;
T.embedding = {1: [-0.6,1],2: [0,-1],3: [0.6,1]};
T.alt_embedding = {1 : [-1,0], 2: [0,0], 3: [1,0]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letter.rotate_isotopy(T,-0.5);
algtop.letters["V"] = T;

/***********************************************************************/
// W

T = Object.create(algtop.letter);
T.letter = 'W';
T.vertices = [1,2,3,4,5];
T.max_simplices = [[1,2],[2,3],[3,4],[4,5]];
T.embedding_dim = 2;
T.embedding = {1: [-0.6,1],2: [-0.3,-1],3: [0,1],4: [0.3,-1],5: [0.6,1]};
T.alt_embedding = {1 : [-1,0], 2: [-0.5,0], 3: [0,0],4: [0.4,0],5: [1,0]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letter.rotate_isotopy(T,-0.5);
algtop.letters["W"] = T;

/***********************************************************************/
// X

T = Object.create(algtop.letter);
T.letter = 'X';
T.vertices = [1,2,3,4,5];
T.max_simplices = [[1,2],[2,3],[2,4],[2,5]];
T.embedding_dim = 2;
T.embedding = {1: [-0.5,-1],2: [0,0],3: [-0.5,1],
                         4: [0.5,-1],5: [0.5,1]
              };
T.alt_embedding = {1 : [-1,-1], 2: [0,0], 3: [-1,1],
		   4: [1,-1],5: [1,1]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letters["X"] = T;

/***********************************************************************/
// Y

T = Object.create(algtop.letter);
T.letter = 'Y';
T.vertices = [1,2,3,4];
T.max_simplices = [[1,2],[2,3],[2,4]];
T.embedding_dim = 2;
T.embedding = {1: [0,-1],2: [0,0],3: [-0.7,1],4: [0.7,1]};
T.alt_embedding = {1 : [0,-1], 2: [0,1], 3: [-1,1],4: [1,1]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letters["Y"] = T;

/***********************************************************************/
// Z

T = Object.create(algtop.letter);
T.letter = 'Z';
T.vertices = [1,2,3,4];
T.max_simplices = [[1,2],[2,3],[3,4]];
T.embedding_dim = 2;
T.embedding = {1: [0.5,-1],2: [-0.5,-1],3: [0.5,1],4: [-0.5,1]};
T.alt_embedding = {1 : [0,-1], 2: [0,-0.33], 3: [0,0.33],4: [0,1]};
algtop.letter.set_map(T);
algtop.letter.set_alt_map(T);
algtop.letter.set_isotopy(T);
algtop.letters["Z"] = T;
