export interface MapTileConfig {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string[];
  requiresApiKey: boolean;
}

export interface MapProvider {
  getConfig(): MapTileConfig;
}

export class OpenStreetMapProvider implements MapProvider {
  getConfig(): MapTileConfig {
    return {
      id: 'osm',
      name: 'OpenStreetMap Standard',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      requiresApiKey: false,
    };
  }
}

export class CartoDarkProvider implements MapProvider {
  getConfig(): MapTileConfig {
    // Uses publicly accessible CartoDB Positron/Dark tiles with OSM attribution, no API key required
    return {
      id: 'carto-dark',
      name: 'Carto Dark (OSM Compatible)',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: ['a', 'b', 'c', 'd'],
      requiresApiKey: false,
    };
  }
}

export function getMapProvider(type: string = 'osm'): MapProvider {
  switch (type.toLowerCase()) {
    case 'carto-dark':
    case 'dark':
      return new CartoDarkProvider();
    case 'osm':
    default:
      return new OpenStreetMapProvider();
  }
}
