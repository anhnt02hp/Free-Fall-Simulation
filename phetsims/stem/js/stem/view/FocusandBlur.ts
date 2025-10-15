import Vector2 from '../../../../dot/js/Vector2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';

export default class FocusManager {
  private hasFocused = false;

  constructor(
    private node: Node,            // The Node to manage (your TextField)
    private background: Rectangle  // The background to recolor
  ) {
    this.setupFocusEvents();
  }

  private setupFocusEvents() {
    this.node.addInputListener({
        down: () => {
            this.hasFocused = true;
            this.background.stroke = 'lightgray';
  }
});
    (this.node as any).onStatic('addedToSence', () => {
        const root = (this.node as any).getRoot?.();
        if (!root) return;

        root.addInputListener({
            down: (event: any) => {
                if (!this.node.globalBounds.containsPoint(event.pointer.point)) {
                    this.hasFocused = false;
                    this.background.stroke = 'black';
                }
            }
        })
    });
  }
  
  public isFocused(): boolean {
    return this.hasFocused;
  }
}
