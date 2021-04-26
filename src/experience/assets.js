export default () => [
  {
    name: 'office',
    data: { index: 0 },
    items: [
      { name: 'officeModel', source: '/models/office-unwrap.glb' },
      { name: 'officeTexture', source: '/textures/bakedv1.png', type: 'texture' },
      { name: 'officeShadowTexture', source: 'textures/floorShadow.jpg', type: 'texture' },
      { name: 'officeLightTexture', source: 'textures/shadowBakev1.png', type: 'texture' },
    ],
  },
];
