export default () => [
  {
    name: 'office',
    data: { index: 0 },
    items: [
      { name: 'officeModel', source: '/models/officev3.glb' },
      { name: 'manModel', source: '/models/man.glb' },
      { name: 'bookTexture', source: '/textures/bookBake-small.webp', type: 'texture' },
      { name: 'manTexture1', source: '/textures/manBake1.webp', type: 'texture' },
      { name: 'manTexture2', source: '/textures/manBake2.webp', type: 'texture' },
      { name: 'deskTexture1', source: '/textures/deskBake1-small.webp', type: 'texture' },
      { name: 'deskTexture2', source: '/textures/deskBake2-small.webp', type: 'texture' },
      { name: 'deskTexture3', source: '/textures/deskBake3-small.webp', type: 'texture' },
      { name: 'chairTexture', source: '/textures/chairBake-small.webp', type: 'texture' },
      { name: 'roomTexture', source: '/textures/roomBake-small.webp', type: 'texture' },
      { name: 'curtainTexture', source: 'textures/curtainPattern.png', type: 'texture' },
    ],
  },
];
