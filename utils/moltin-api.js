import moltinConfig from 'moltin.config.json';
import { gateway as MoltinGateway } from '@moltin/sdk';

const Moltin = MoltinGateway(moltinConfig);

export default Moltin;
