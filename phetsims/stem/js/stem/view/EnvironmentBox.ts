import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Property from '../../../../axon/js/Property.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import StemScreenView from './StemScreenView.js';
import stem from '../../stem.js';
import Environment from '../model/EnvironmentChange.js';



export default class EnviromentBox extends Node {

    private environment: Environment;
    private updateColorsCallback: (env: 'Earth' | 'Mars' | 'Moon') => void;

    constructor(infoBoxA: Rectangle, environment: Environment, updateColorsCallback: (env: 'Earth' | 'Mars' | 'Moon') => void) {
        super();
        this.environment = environment;
        this.updateColorsCallback = updateColorsCallback;

        //-------- Vị trí EnviromentBox --------//
        const EnvBox_X = infoBoxA.right + 10;
        const EnvBox_Y = infoBoxA.top;

        //-------- Kích thước EnviromentBox --------//
        const BoxWidth = 155;
        const BoxHeight = 200;
        const cornerRadius = 10;

        //-------Tạo EnvironmentBox-------//
        const EnvBox = new Rectangle(
            EnvBox_X, EnvBox_Y,
            BoxWidth, BoxHeight,
            {
                fill: 'white',
                stroke: 'black',
                lineWidth: 1,
                cornerRadius: cornerRadius
            }
        );
        this.addChild(EnvBox);

        //-------Tạo tiêu đề hiển thị--------//
        const titleEnv = new Text('ENVIRONMENT', {
            font: new PhetFont({ size: 16, weight: 'bold' }),
            fill: 'black'
        });
        titleEnv.left = EnvBox.left + 10;
        titleEnv.top = EnvBox.top + 10;
        this.addChild(titleEnv);

        //--------- Tạo danh sách môi trường---------//
        const envOptions = [
            { value: 'Earth' as const, createNode: () => new Text('Earth', { font: new PhetFont(12) }) },
            { value: 'Mars' as const, createNode: () => new Text('Mars', { font: new PhetFont(12) }) },
            { value: 'Moon' as const, createNode: () => new Text('Moon', { font: new PhetFont(12) }) }
        ];

        const selectedEnvProperty = new Property<'Earth' | 'Mars' | 'Moon'>('Earth');

        const comboEnv = new ComboBox(selectedEnvProperty, envOptions, EnvBox, {
            listPosition: 'below',
            xMargin: 5,
            yMargin: 5
        });

        comboEnv.left = EnvBox.left + 10;
        comboEnv.top = EnvBox.top + 5;
        this.addChild(comboEnv);

        //--------- Lắng nghe sự kiện chọn môi trường ---------//
        selectedEnvProperty.link((envName: 'Earth' | 'Mars' | 'Moon') => {
            this.environment.setEnvironment(envName);
            this.updateColorsCallback(envName); // ← Gọi về StemScreenView để đổi màu
        });
    }
}


