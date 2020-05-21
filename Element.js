class Element {
    constructor(r, c, x, y, size_w, size_h, data, grid) {
        this.row = r;
        this.col = c;
        this.x = x;
        this.y = y
        this.w = size_w;
        this.h = size_h

        this.colour = color(255);
        this.data = data;
        this.newData = null;
        this.grid = grid;
        this.dragged = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.sliding = false;
    }

    show() {
        if (this.data != "BLANK") {
            if (this.data == null) print(this);
            let r = parseInt(this.data.substring(0, 1));
            let c = parseInt(this.data.substring(1, 2));
            let x = c * this.w;
            let y = r * this.h
            image(img, this.x, this.y, this.w, this.h, x / sf, y / sf, this.w / sf, this.h / sf);
        }
        stroke(0, 100);
        strokeWeight(1);
        noFill();
        rect(this.x, this.y, this.w, this.h);
    }

    /*update() {

    }*/

    setData(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    setNewData(data) {
        this.newData = data;
    }

    touched() {
        updating = true;
        if (this.row == this.grid.blank.row) {
            if (this.col > this.grid.blank.col) {
                this.shiftWest();
            } else {
                this.shiftEast();
            }
        } else if (this.col == this.grid.blank.col) {
            if (this.row > this.grid.blank.row) {
                this.shiftNorth();
            } else {
                this.shiftSouth();
            }
        }
    }

    checkTouched(mx, my) {
        if (mx >= this.x && mx < this.x + this.w &&
            my >= this.y && my < this.y + this.h) {
            if (this == this.grid.blank) {
                return;
            }
            /*if (this.validity((this.x / this.w), (this.grid.blank.x / this.w))) {
                return;
            }
            if (this.validity((this.y / this.h), (this.grid.blank.y / this.h))) {
                return;
            }*/
            this.touched();
            if (!playing) playing = true;
        }
    }

    moveByKey(key) {
        var position_element_x = this.x / this.w;
        var position_element_y = this.y / this.h;
        var position_blank_x = this.grid.blank.x / this.w;
        var position_blank_y = this.grid.blank.y / this.h;
        /*if (this.validity(position_element_x, position_blank_x) || this.validity(position_element_y, position_blank_y)) {
            return false;
        }
        if (this == this.grid.blank) {
            return false;
        }*/
        if (key == "ArrowUp") {
            if (position_element_y - position_blank_y != 1 || position_element_x != position_blank_x) {
                return false;
            }
        } else if (key == "ArrowDown") {
            if (position_element_y - position_blank_y != -1 || position_element_x != position_blank_x) {
                return false;
            }
        } else if (key == "ArrowLeft") {
            if (position_element_x - position_blank_x != 1 || position_element_y != position_blank_y) {
                return false;
            }
        } else { //key == "ArrowRight"
            if (position_element_x - position_blank_x != -1 || position_element_y != position_blank_y) {
                return false;
            }
        }
        // console.log(str(position_blank_x) + ',' + str(position_blank_y))
        // console.log(str(position_element_x) + ',' + str(position_element_y))
        // console.log("--")
        this.touched();
        if (!playing) playing = true;
        return true;
    }

    /*validity(c, b) {
        if (Math.abs(c - b) == 2) {
            return true;
        }
        return false;
    }*/

    shiftNorth() {
        for (let r = 0; r < this.grid.num_rows; r++) {
            this.grid.elements[this.grid.getKey(r, this.col)].newData = null;
        }
        let endRow = this.grid.blank.row + 1;
        this.grid.blank.sliding = true;
        let temp = this.grid.elements[this.grid.getKey(endRow, this.col)].data;
        for (let r = endRow; r <= this.row; r++) {
            let e = this.grid.elements[this.grid.getKey(r, this.col)];
            e.startSlide("North");
            if (r < this.row) {
                let f = this.grid.getSouth(e);
                e.newData = f.data;
            }

        }
        this.newData = this.grid.blank.data;
        this.grid.blank.newData = temp;
        this.grid.blank = this;
    }

    shiftEast() {
        for (let c = 0; c < this.grid.num_cols; c++) {
            this.grid.elements[this.grid.getKey(this.row, c)].newData = null;
        }
        let endCol = this.grid.blank.col - 1;
        this.grid.blank.sliding = true;
        let temp = this.grid.elements[this.grid.getKey(this.row, endCol)].data;
        for (let c = endCol; c >= this.col; c--) {
            let e = this.grid.elements[this.grid.getKey(this.row, c)];
            e.startSlide("East");
            if (c > this.col) {
                let f = this.grid.getWest(e);
                e.newData = f.data;
            }
        }
        this.newData = this.grid.blank.data;
        this.grid.blank.newData = temp;
        this.grid.blank = this;
    }

    shiftSouth() {
        for (let r = 0; r < this.grid.num_rows; r++) {
            this.grid.elements[this.grid.getKey(r, this.col)].newData = null;
        }
        let endRow = this.grid.blank.row - 1;
        this.grid.blank.sliding = true;
        let temp = this.grid.elements[this.grid.getKey(endRow, this.col)].data;
        for (let r = endRow; r >= this.row; r--) {
            let e = this.grid.elements[this.grid.getKey(r, this.col)];
            e.startSlide("South");
            if (r > this.row) {
                let f = this.grid.getNorth(e);
                e.newData = f.data;
            }

        }
        this.newData = this.grid.blank.data;
        this.grid.blank.newData = temp;
        this.grid.blank = this;
    }

    shiftWest() {
        for (let c = 0; c < this.grid.num_cols; c++) {
            this.grid.elements[this.grid.getKey(this.row, c)].newData = null;
        }
        let endCol = this.grid.blank.col + 1;
        this.grid.blank.sliding = true;
        let temp = this.grid.elements[this.grid.getKey(this.row, endCol)].data;
        for (let c = endCol; c <= this.col; c++) {
            let e = this.grid.elements[this.grid.getKey(this.row, c)];
            e.startSlide("West");
            if (c < this.col) {
                let f = this.grid.getEast(e);
                e.newData = f.data;
            }

        }
        this.newData = this.grid.blank.data;
        this.grid.blank.newData = temp;
        this.grid.blank = this;
    }

    findBlank() {
        let e;
        e = this.grid.getNorth(this);
        if (e && e.getData() == "BLANK") return e;
        e = this.grid.getSouth(this);
        if (e && e.getData() == "BLANK") return e;
        e = this.grid.getEast(this)
        if (e && e.getData() == "BLANK") return e;
        e = this.grid.getWest(this);
        if (e && e.getData() == "BLANK") return e;
        return false;
    }

    startSlide(d) {
        this.sliding = true;
        if (d == "North") {
            this.slideNorth();
        }
        if (d == "East") {
            this.slideEast();
        } else if (d == "South") {
            this.slideSouth();
        } else if (d == "West") {
            this.slideWest();
        }
    }

    slideNorth() {
        if (debug) print("slideNorth");
        this.slide_X = this.x;
        this.slide_Y = this.y;
        this.slide_endX = this.x;
        this.slide_endY = this.y - this.h;
        this.slide_dX = 0;
        this.slide_dY = -slide_rate;
        let r = parseInt(this.data.substring(0, 1));
        let c = parseInt(this.data.substring(1, 2));
        this.slide_imgX = c * this.w;
        this.slide_imgY = r * this.h;
    }

    slideEast() {
        if (debug) print("slideEast");
        this.slide_X = this.x;
        this.slide_Y = this.y;
        this.slide_endX = this.x + this.w;
        this.slide_endY = this.y;
        this.slide_dX = slide_rate;
        this.slide_dY = 0;
        let r = parseInt(this.data.substring(0, 1));
        let c = parseInt(this.data.substring(1, 2));
        this.slide_imgX = c * this.w;
        this.slide_imgY = r * this.h;
    }

    slideSouth() {
        if (debug) print("slideSouth");
        this.slide_X = this.x;
        this.slide_Y = this.y;
        this.slide_endX = this.x;
        this.slide_endY = this.y + this.h;
        this.slide_dX = 0;
        this.slide_dY = slide_rate;
        let r = parseInt(this.data.substring(0, 1));
        let c = parseInt(this.data.substring(1, 2));
        this.slide_imgX = c * this.w;
        this.slide_imgY = r * this.h;
    }

    slideWest() {
        if (debug) print("slideWest");
        this.slide_X = this.x;
        this.slide_Y = this.y;
        this.slide_endX = this.x - this.w;
        this.slide_endY = this.y;
        this.slide_dX = -slide_rate;
        this.slide_dY = 0;
        let r = parseInt(this.data.substring(0, 1));
        let c = parseInt(this.data.substring(1, 2));
        this.slide_imgX = c * this.w;
        this.slide_imgY = r * this.h;
    }


    slide() {
        if (this.data == "BLANK") return;
        if (this.slide_endX == undefined) return;
        //    print(this.col, this.slide_X, this.slide_endX, this.data, this.newData);
        this.slide_X += this.slide_dX;
        this.slide_Y += this.slide_dY;
        if ((this.slide_dX > 0 && this.slide_X >= this.slide_endX) ||
            (this.slide_dX < 0 && this.slide_X <= this.slide_endX) ||
            (this.slide_dY > 0 && this.slide_Y >= this.slide_endY) ||
            (this.slide_dY < 0 && this.slide_Y <= this.slide_endY)) {
            //      print(this);
            this.sliding = false;
            for (let c = 0; c < this.grid.num_cols; c++) {
                let e = this.grid.elements[this.grid.getKey(this.row, c)];
                if (e.newData) {
                    e.data = e.newData;
                    e.sliding = false;
                }
            }
            for (let r = 0; r < this.grid.num_rows; r++) {
                let e = this.grid.elements[this.grid.getKey(r, this.col)];
                if (e.newData) {
                    e.data = e.newData;
                    e.sliding = false;
                }
            }
        } else {
            image(img, this.slide_X, this.slide_Y, this.w, this.h,
                this.slide_imgX / sf, this.slide_imgY / sf, this.w / sf, this.h / sf);
        }
    }

    isSliding() {
        return this.sliding;
    }
}