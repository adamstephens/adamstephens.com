export default () => [
  {
    name: 'office',
    data: { index: 0 },
    items: [
      { name: 'officeModel', source: '/models/officev2.glb' },
      { name: 'manModel', source: '/models/man.glb' },
      { name: 'manTexture1', source: '/textures/manBake1.jpg', type: 'texture' },
      { name: 'manTexture2', source: '/textures/manBake2.jpg', type: 'texture' },
      { name: 'deskTexture1', source: '/textures/deskBake1.jpg', type: 'texture' },
      { name: 'deskTexture2', source: '/textures/deskBake2.jpg', type: 'texture' },
      { name: 'deskTexture3', source: '/textures/deskBake3.jpg', type: 'texture' },
      { name: 'chairTexture', source: '/textures/chairBake.jpg', type: 'texture' },
      { name: 'roomTexture', source: '/textures/roomBake.jpg', type: 'texture' },
      { name: 'curtainTexture', source: 'textures/curtainPattern.png', type: 'texture' },
    ],
  },
];
