import { Map } from '@/components/Map';


export const BasicMap = ({ width = 700, height = 400 }) => {
    if (width === 0) {
        return null;
    }
    const data = require('../map-data/de.json');

    return <Map data={data} width={width} height={height} />;
};
