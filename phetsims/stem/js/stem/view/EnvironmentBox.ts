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
import StemModel from '../model/StemModel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Font from '../../../../scenery/js/util/Font.js';
import TextField from './TextField.js';






export default class EnviromentBox extends Node {

    private environment: Environment;
    private updateColorsCallback: (env: 'Earth' | 'Mars' | 'Moon') => void;
    private model: StemModel;

    constructor(infoBoxA: Rectangle, environment: Environment, updateColorsCallback: (env: 'Earth' | 'Mars' | 'Moon') => void, model: StemModel) {
        super();
        this.environment = environment;
        this.updateColorsCallback = updateColorsCallback;
        this.model = model;

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
            
            //Đồng bộ gravity và airResistance vào StemModel
            this.model.objectA.gravity = this.environment.gravity * 100;
            this.model.objectB.gravity = this.environment.gravity * 100;
            this.model.objectA.airResistanceCoefficient = this.environment.airResistance;
            this.model.objectB.airResistanceCoefficient = this.environment.airResistance;
        });

        //---------Tạo hiển thị khối lượng--------//
        const titleMass = new Text('m =', {
        font: new PhetFont({ size: 16, weight: 'bold' }),
        fill: 'black'
        });
        titleMass.right = titleEnv.left + 30;
        titleMass.top = titleEnv.bottom + 15;
        this.addChild(titleMass);


        //---------Tạo ô nhập khối lượng (TextField) ---------//
        const massProperty = new NumberProperty(1, { range: new Range(0.1, 1000) });
        //-------Nhập giá trị------//
        const massInput = new TextField({
            width: 60,
            height: 25,
            fontSize: 16
        });
        //--------Danh sách item--------//
        const unitProperty = new Property<'kg' | 'g'>( 'kg');

        const unitItems = [
            {value: 'kg' as const, 
                createNode:() => new Text('kg', { font: new PhetFont( 16 ) })},
            {value: 'g' as const, 
                createNode:() => new Text('g', { font: new PhetFont( 16 ) })},
        ];

        const unitComboBox = new ComboBox(unitProperty, unitItems, EnvBox, {
            xMargin: 5,
            yMargin: 2
        });

        massInput.left = titleMass.right + 10;
        massInput.top = titleMass.top;
        unitComboBox.left = massInput.right + 5;
        unitComboBox.top = massInput.top
        this.addChild(massInput);
        this.addChild(unitComboBox);

        //------- Cập nhật đơn vị-------//
        unitProperty.link(unit =>{
            const valKg = massProperty.value;

            if ( unit === 'kg') {
                massInput.setValue( valKg.toFixed( 2 ));
            }
            else {
                massInput.setValue((valKg * 1000).toFixed( 0 ));
            }
        });
        
        //-------Khi người dùng nhập số => cập nhật massProperty------//
        window.addEventListener('keydown', () => {
            const val = parseFloat(massInput.getValue());
            if (!isNaN(val)) {
                if (unitProperty.value === 'kg') {
                    massProperty.value = val;
                }
                else {
                    massProperty.value = val / 1000;
                }

        //---------Đồng bộ vào model---------//
                this.model.objectA.mass = massProperty.value;
                this.model.objectB.mass = massProperty.value;
            }
        });

        
}
}


