import module from '../../module';
import './styles.scss';

const FORM_CSS_PREFIX = module.cssPrefix.childPrefix('menu').childPrefix('customPacts');
const CSS = {
  levelHeaders: FORM_CSS_PREFIX.child('levelHeaders'),
  level: FORM_CSS_PREFIX.child('level'),
  progression: FORM_CSS_PREFIX.child('progression'),
} as const;

export default CSS;
