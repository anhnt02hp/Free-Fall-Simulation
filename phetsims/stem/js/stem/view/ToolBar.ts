import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Shape from '../../../../kite/js/Shape.js';

export interface ToolItem {
  type: string;                // loại object (ball, box, triangle, ...)
  shape: 'circle' | 'square' | 'triangle';
  color: string;
}

export default class Toolbar extends Node {

  private readonly tools: ToolItem[];
  private readonly rootNode: Node;

  public onDrop: (type: string, x: number, y: number) => void = () => {};

  constructor(tools: ToolItem[], rootNode: Node) {
    super({ pickable: true });

    this.tools = tools;
    this.rootNode = rootNode;

    // === 1. Tạo nền toolbar ===
    const bgHeight = tools.length * 70 + 20;
    const background = new Rectangle(0, 0, 90, bgHeight, {
      fill: '#f5f5f5',
      stroke: 'black',
      cornerRadius: 10,
      cursor: 'default',
      pickable: true
    });
    this.addChild(background);

    // === 2. Thêm icon cho từng tool ===
    tools.forEach((tool, index) => {
      const iconNode = this.createIconNode(tool);
      iconNode.left = 20;
      iconNode.top = 20 + index * 70;
      iconNode.cursor = 'pointer';
      iconNode.pickable = true;

      let isDragging = false;
      let ghost: Node | null = null;

      // === 3. Listener global cho kéo-thả ===
      const dragListener = {
        move: (event: any) => {
          if (isDragging && ghost) {
            const localPoint = this.rootNode.globalToLocalPoint(event.pointer.point);
            ghost.centerX = localPoint.x;
            ghost.centerY = localPoint.y;
          }
        },
        up: (event: any) => {
          if (isDragging) {
            isDragging = false;
            if (ghost) {
              const dropPoint = this.rootNode.globalToLocalPoint(event.pointer.point);
              this.rootNode.removeChild(ghost);
              ghost = null;
              this.rootNode.removeInputListener(dragListener);

              // Gọi callback để StemScreenView xử lý tạo object
              this.triggerDrop(tool.type, dropPoint.x, dropPoint.y);
            }
          }
        }
      };

      // === 4. Lắng nghe sự kiện bắt đầu kéo ===
      iconNode.addInputListener({
        down: (event: any) => {
          isDragging = true;

          // Tạo ghost icon ở rootNode
          ghost = this.createIconNode(tool);
          ghost.cursor = 'grabbing';
          ghost.pickable = false;
          this.rootNode.addChild(ghost);

          // Đặt vị trí ban đầu của ghost
          const globalPoint = event.pointer.point;
          const localPoint = this.rootNode.globalToLocalPoint(globalPoint);
          ghost.centerX = localPoint.x;
          ghost.centerY = localPoint.y;

          // Quan trọng: đăng ký listener toàn màn hình
          this.rootNode.addInputListener(dragListener);
        }
      });

      this.addChild(iconNode);
    });
  }

  // === 5. Hàm tạo icon ===
  private createIconNode(tool: ToolItem): Node {
    if (tool.shape === 'circle') {
      return new Circle(20, { fill: tool.color, stroke: 'black' });
    }
    if (tool.shape === 'square') {
      return new Rectangle(0, 0, 40, 40, { fill: tool.color, stroke: 'black' });
    }

    const triangleShape = new Shape()
      .moveTo(0, 40)
      .lineTo(20, 0)
      .lineTo(40, 40)
      .close();

    return new Path(triangleShape, { fill: tool.color, stroke: 'black' });
  }

  // === 6. Hàm gọi callback ra ngoài ===
  private triggerDrop(type: string, x: number, y: number) {
    this.onDrop(type, x, y);
  }
}
