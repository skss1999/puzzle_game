class Grid {
    constructor(x, y, rows, cols, w, h, square, d) {
        this.x = x;
        this.y = y;
        this.num_elements = rows * cols;
        this.num_rows = rows;
        this.num_cols = cols;
        this.w = w;
        this.h = h;
        this.elements = {};
        if (square) {
            this.col_width = floor(min(w, h) / this.num_cols);
            this.col_height = floor(min(w, h) / this.num_cols);
        } else {
            this.col_width = floor(w / this.num_cols);
            this.col_height = floor(h / this.num_rows);
        }
        this.dragged = null;
        this.data = d;
        this.blank = null;
    }

    initialiseGrid() {
        for (let r = 0; r < this.num_rows; r++) {
            for (let c = 0; c < this.num_cols; c++) {
                let x = this.x + this.col_width * c;
                let y = this.y + this.col_height * r;
                let e;
                e = new Element(r, c, x, y, this.col_width, this.col_height,
                    `${r}${c}`, this);
                let key = this.getKey(r, c);
                this.elements[key] = e;
            }
        }
        this.blank = this.elements[this.getKey(this.num_rows - 1, this.num_cols - 1)]
        this.blank.setData("BLANK");
    }

    addData(data) {
        print(data);
        this.data = data;
        let dataIndex = 0;
        for (let r = 0; r < this.num_rows; r++) {
            for (let c = 0; c < this.num_cols; c++) {
                /*let x = this.x + this.col_width * c;
                let y = this.y + this.col_height * r;*/
                let e = this.getElementAt(r, c);
                e.setData(this.data[dataIndex++]);
            }
        }
    }

    printData() {
        for (let key in this.elements) {
            let e = this.elements[key];
            print(key, e.data, e.row, e.col)
        }
    }

    isCompleted() {
        for (let key in this.elements) {
            let e = this.elements[key];
            let r = parseInt(e.data.substring(0, 1));
            let c = parseInt(e.data.substring(1, 2));
            if (e.data == "BLANK") {
                if (e.row !== this.num_rows - 1 || e.col !== this.num_cols - 1) return false;
            } else if (r != e.row || c != e.col) return false;
        }
        return true;
    }

    getKey(r, c) {
        r = "" + r;
        while (r.length < 3) r = "0" + r;
        c = "" + c;
        while (c.length < 3) c = "0" + c;
        return `R${r}C${c}`;
    }

    getElementAt(r, c) {
        let key = this.getKey(r, c);
        return this.elements[key];
    }

    getClicked(mx, my) {
        for (let key in this.elements) {
            let e = this.elements[key];
            let x = e.col * this.col_width;
            let y = e.row * this.col_height;
            if (mx >= x && mx <= x + this.col_width &&
                my >= y && my <= y + this.col_height) {
                return e;
            }
        }
    }

    show() {
        stroke(0);
        strokeWeight(2);
        noStroke();
        fill(240);
        rect(this.x, this.y, this.w, this.h);
        let anyMoving = false;
        for (let key in this.elements) {
            let e = this.elements[key];
            if (e.isSliding()) {
                e.slide();
                anyMoving = true;
            } else {
                e.show();
            }
        }
        if (!anyMoving) updating = false;

    }

    /*update() {
        for (let key in this.elements) {
            if (this.elements[key]) this.elements[key].update();
        }
    }*/

    getNorth(element) {
        if (element.row > 0) {
            return this.getElementAt(element.row - 1, element.col)
        } else return null;
    }

    getEast(element) {
        if (element.col + 1 < this.num_cols) {
            return this.getElementAt(element.row, element.col + 1);
        } else return null;
    }

    getSouth(element) {
        if (element.row + 1 < this.num_rows) {
            return this.getElementAt(element.row + 1, element.col);
        } else return null;
    }

    getWest(element) {
        if (element.col > 0) {
            return this.getElementAt(element.row, element.col - 1);
        } else return null;
    }
}