/* Copyright (C) 2025 - Kristoffer A. Wright - All Rights Reserved */

/* LETRIS - A tile dropping game where you spell words to clear the board. */


const VERSION_NUMBER = "0.1.12";


/* ----- DOM ELEMENT IDs ----- */

const DOM_CANVAS_ID = "main-canvas";
const DOM_DIV_ID = "main-div";

/* ----- LAYOUT (CONSTANT) ----- */

const LAYOUT_GRID_WIDTH = 6;
const LAYOUT_GRID_HEIGHT = 12;
const LAYOUT_TILE_BORDER_RATIO = 0.1;
const LAYOUT_TILE_FONT_RATIO = 0.5;
const LAYOUT_SPLASH_TITLE_FONT_RATIO = 2;
const LAYOUT_SPLASH_BODY_FONT_RATIO = 0.6;
const LAYOUT_SPLASH_VERSION_FONT_RATIO = 0.3;
const LAYOUT_SPLASH_TITLE_Y_RATIO = 0.2;
const LAYOUT_SPLASH_BODY_Y_RATIO = 0.7;
const LAYOUT_SPLASH_VERSION_Y_RATIO = 0.95;
const LAYOUT_GAME_OVER_LINE_1_Y_RATIO = 0.2;
const LAYOUT_GAME_OVER_LINE_2_Y_RATIO = 0.3;
const LAYOUT_GAME_OVER_LINE_3_Y_RATIO = 0.5;
const LAYOUT_GAME_OVER_LINE_4_Y_RATIO = 0.8;
const LAYOUT_GAME_OVER_SMALL_FONT_RATIO = 0.6;
const LAYOUT_GAME_OVER_LARGE_FONT_RATIO = 2;
const LAYOUT_UP_DOWN_BUTTON_HEIGHT_RATIO = 0.25;
const LAYOUT_LEFT_RIGHT_BUTTON_WIDTH_RATIO = 0.5;
const LAYOUT_FREE_TILE_COUNT = 3;
const LAYOUT_DEBUG_FONT_SIZE = 16;

/* ----- CLOCK AND PACING ----- */

const BASE_DROP_SPEED = 1;
const FAST_DROP_SPEED = 4;
const FRAMES_PER_SECOND = 20;
const TICKS_PER_FRAME = Math.floor(1000 / FRAMES_PER_SECOND);       // TODO DEPRECATED
const CLOCK_MINIMUM_FRAME_DURATION = 1;

/* ----- COLORS ----- */

const COLOR_BACKGROUND = "#483D8B";                     // Slate Blue
const COLOR_BORDER = "#6A5ACD";                         // Dark Slate Blue
const COLOR_TILE_BODY = "#FFEFD5";                      // Dark Orange
const COLOR_TILE_BORDER = "#FF8C00";                    // Papaya Whip
const COLOR_FLASH_A = "#000000";                        // Black
const COLOR_FLASH_B = "#DCDCDC";                        // Gainsboro
const COLOR_GAME_OVER = "#DC143C";                      // Crimson
const COLOR_SPLASH_TEXT = "#B690FA";                    // CUSTOM
const COLOR_DEBUG_TEXT = "#FFFFFF";                     // White

/* ----- FONTS ----- */

const FONT_TYPEFACE_MAIN = "Arial";

/* ----- RULES ----- */

const RULE_MIN_WORD_LENGTH = 3;

/* ----- ANIMATION ----- */

const ANIMATION_FLASH_COUNT = 12;
const ANIMATION_FLASH_LENGTH = 0.2;                     // Seconds

/* ----- EXECUTION STAGE ENUM ----- */

const STAGE_ENUM_SPLASH = 0;
const STAGE_ENUM_PLAYING = 1;
const STAGE_ENUM_GAME_OVER = 2;                         // TODO DEPRECATED



/* ----- DOM ELEMENTS ----- */

let element_canvas = null;
let element_div = null;

/* ----- CONTEXTS ----- */

let context_canvas = null;

/* ----- LAYOUT (VARIABLE) ----- */

let layout_grid_size = 0;
let layout_screen_width = 0;
let layout_screen_height = 0;
let layout_tile_border_size = 0;
let layout_tile_font_size = 0;
let layout_splash_title_font_size = 0;
let layout_splash_body_font_size = 0;
let layout_splash_version_font_size = 0;
let layout_game_over_small_font_size = 0;
let layout_game_over_large_font_size = 0;
let layout_up_button_zone_start = 0;
let layout_up_button_zone_end = 0;
let layout_down_button_zone_start = 0;
let layout_down_button_zone_end = 0;
let layout_left_button_zone_start = 0;
let layout_left_button_zone_end = 0;
let layout_right_button_zone_start = 0;
let layout_right_button_zone_end = 0;

/* ----- GAME STATE ----- */

let game_score = 0;
let game_tile_map = null;
let game_free_tiles = [];
let game_free_tiles_position_x = 0;
let game_free_tiles_position_y = 0;
let game_free_tiles_column = 0;
let game_last_touch_x = 0;
let game_last_touch_y = 0;
let game_drop_speed = 0;
let game_background = "";
let game_stage = 0;

/* ----- INPUT STATE ----- */

let input_is_pressed = false;

/* ----- CLOCK STATE ----- */

let clock_last_tick = 0;
let clock_frame_count = 0;
let clock_second_count = 0;
let clock_live_fps = 0;

/* ----- INITIALIZATION FUNCTIONS (EXCEPT INPUT INIT) ----- */

function initialize_elements() {
    element_canvas = document.getElementById(DOM_CANVAS_ID);
    element_div = document.getElementById(DOM_DIV_ID);
}

function initialize_contexts() {
    context_canvas = element_canvas.getContext("2d");
}

function initialize_layout() {
    layout_screen_width = window.innerWidth;
    layout_screen_height = window.innerHeight;
    
    // Find the tile size that best fits the real screen.
    const grid_size_guess_x = Math.floor(layout_screen_width / LAYOUT_GRID_WIDTH);
    const grid_size_guess_y = Math.floor(layout_screen_height / LAYOUT_GRID_HEIGHT);

    // The larger guess will not work because the resulting rectangle won't fit on the real screen.
    if (grid_size_guess_x < grid_size_guess_y) {
        layout_grid_size = grid_size_guess_x;
    } else {
        layout_grid_size = grid_size_guess_y;
    }
   
    layout_tile_border_size = Math.floor(layout_grid_size * LAYOUT_TILE_BORDER_RATIO);
    layout_tile_font_size = Math.floor(layout_grid_size * LAYOUT_TILE_FONT_RATIO);
    layout_splash_title_font_size = Math.floor(layout_grid_size * LAYOUT_SPLASH_TITLE_FONT_RATIO);
    layout_splash_body_font_size = Math.floor(layout_grid_size * LAYOUT_SPLASH_BODY_FONT_RATIO);
    layout_splash_version_font_size = Math.floor(layout_grid_size * LAYOUT_SPLASH_VERSION_FONT_RATIO);
    layout_game_over_small_font_size = Math.floor(layout_grid_size * LAYOUT_GAME_OVER_SMALL_FONT_RATIO);
    layout_game_over_large_font_size = Math.floor(layout_grid_size * LAYOUT_GAME_OVER_LARGE_FONT_RATIO);

    layout_left_button_zone_start = 0;
    layout_left_button_zone_end = Math.floor(layout_screen_width * LAYOUT_LEFT_RIGHT_BUTTON_WIDTH_RATIO);
    layout_right_button_zone_start = layout_left_button_zone_end;
    layout_right_button_zone_end = layout_screen_width;
    layout_up_button_zone_start = 0;
    layout_up_button_zone_end = Math.floor(layout_screen_height * LAYOUT_UP_DOWN_BUTTON_HEIGHT_RATIO);
    layout_down_button_zone_start = layout_up_button_zone_end * 3;
    layout_down_button_zone_end = layout_screen_height;

    element_canvas.width = layout_grid_size * LAYOUT_GRID_WIDTH;
    element_canvas.height = layout_grid_size * LAYOUT_GRID_HEIGHT;
    element_canvas.style.background = COLOR_BACKGROUND;
    element_div.style.background = COLOR_BORDER; 

    /*
    //< ***** DEBUG START *****
    console.log(`----- START LAYOUT INFO -----`);
    console.log(`Screen Width: ${layout_screen_width}`);
    console.log(`Screen Height: ${layout_screen_height}`);
    console.log(`Grid Size: ${layout_grid_size}`);
    console.log(`Tile Border Size: ${layout_tile_border_size}`);
    console.log(`Tile Font Size: ${layout_tile_font_size}`);
    console.log(`Splash Screen Title Font Size: ${layout_splash_title_font_size}`);
    console.log(`Splash Screen Body Font Size: ${layout_splash_body_font_size}`);
    console.log(`Game Over Screen Small Font Size: ${layout_game_over_small_font_size});
    console.log(`Game Over Screen Large Font Size: ${layout_game_over_large_font_size});
    console.log(`Left Button Touch Zone Start: ${layout_left_button_zone_start}`);
    console.log(`Left Button Touch Zone End: ${layout_left_button_zone_end}`);
    console.log(`Right Button Touch Zone Start: ${layout_right_button_zone_start}`);
    console.log(`Right Button Touch Zone End: ${layout_right_button_zone_end}`);
    console.log(`Up Button Touch Zone Start: ${layout_up_button_zone_start}`);
    console.log(`Up Button Touch Zone End: ${layout_up_button_zone_end}`);
    console.log(`Down Button Touch Zone Start: ${layout_down_button_zone_start}`);
    console.log(`----- END LAYOUT INFO -----`);
    //> ***** DEBUG END *****
    */

}

function initialize_game_state() {
    game_score = 0;
    game_tile_map = [
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "]
    ];
    game_free_tiles = ["", "", ""];
    game_free_tiles_position_x = 0;
    game_free_tiles_position_y = -1 * LAYOUT_FREE_TILE_COUNT * layout_grid_size;
    game_free_tiles_column = 0;
    game_last_touch_x = -1;
    game_last_touch_y = -1;
    game_drop_speed = BASE_DROP_SPEED;
    game_sleeping = false;
    game_background = COLOR_BACKGROUND;
    game_stage = STAGE_ENUM_SPLASH; 
}

function initialize_clock() {
    clock_last_tick = Date.now();
}

/* ----- GEOMETRY ROUTINES ----- */

function pixel_to_grid(coordinate) {
    return Math.floor(coordinate / layout_grid_size);
}

/* ----- DRAW FUNCTIONS ----- */

function set_draw_color(color) {
    context_canvas.fillStyle = color;

    /*
    //< ***** DEBUG START *****
    console.log(`Set draw color: ${color}`);
    //> ***** DEBUG END *****
    */ 

}

function set_draw_font(size, typeface) {
    context_canvas.font = `bold ${size}px ${typeface}`;
    context_canvas.textBaseline = "top";

    /*
    //< ***** DEBUG START *****
    console.log(`Set draw font: s:${size}, typeface:${typeface}`);
    //> ***** DEBUG END *****
    */
}

function draw_rectangle(position_x, position_y, width, height) {
    context_canvas.fillRect(position_x, position_y, width, height); 

    /*
    //< ***** DEBUG START *****
    console.log(`Drew rectangle: (${position_x}, ${position_y}) w:${width} h:${height}`);
    //> ***** DEBUG END *****
    */
}

function clear_screen() {
    set_draw_color(game_background);
    draw_rectangle(0, 0, layout_screen_width, layout_screen_height);
}

function draw_text_at(position_x, position_y, text) {
    context_canvas.fillText(text, position_x, position_y);

    /*
    //< ***** DEBUG START *****
    console.log(`Drew text: (${position_x}, ${position_y}) "${text}"`);
    //> ***** DEBUG END *****
    */
}

function guess_text_width(text) {
    return context_canvas.measureText(text).width;
}

function draw_text_center(position_y, text) {
    const position_x = Math.floor(layout_screen_width / 2) - Math.floor(guess_text_width(text) / 2);
    draw_text_at(position_x, position_y, text);
}

function draw_tile(position_x, position_y, letter, body_color, border_color) {

    // Draw the border
    set_draw_color(border_color);
    draw_rectangle(position_x, position_y, layout_grid_size, layout_grid_size);

    // Draw the body
    set_draw_color(body_color);
    draw_rectangle(position_x + layout_tile_border_size, position_y + layout_tile_border_size, 
        layout_grid_size - (2 * layout_tile_border_size), layout_grid_size - (2 * layout_tile_border_size));

    // Draw the letter
    set_draw_color(border_color);
    set_draw_font(layout_tile_font_size, FONT_TYPEFACE_MAIN);
    const letter_width = guess_text_width(letter);
    draw_text_at(position_x + (layout_grid_size / 2) - (letter_width / 2), 
        position_y + (layout_grid_size / 2) - (layout_tile_font_size / 2), letter);

    /* 
    //< ***** DEBUG START *****
    console.log(`Drew tile: (${position_x}, ${position_y}) letter:${letter}`);
    //> ***** DEBUG END *****
    */

}

function draw_tile_map() {
    clear_screen();
    for (let y = 0; y < LAYOUT_GRID_HEIGHT; y++) {
        for (let x = 0; x < LAYOUT_GRID_WIDTH; x++) {
            let current_letter = game_tile_map[y][x];
            if (current_letter !== " ") {
                draw_tile(x * layout_grid_size, y * layout_grid_size, current_letter, COLOR_TILE_BODY, 
                    COLOR_TILE_BORDER);
            }
        }
    }
}

/* ----- RNG FUNCTIONS ----- */

function get_random_int(minimum, maximum) {
    const integer_minimum = Math.ceil(minimum);
    const integer_maximum = Math.floor(maximum);
    return Math.floor(Math.random() * (integer_maximum - integer_minimum) + integer_minimum);
}

function get_random_letter() {
    const random_int = get_random_int(0, 98);
    
    // Match the most likely letters first:
    if (random_int < 12) {
        return 'e';
    }
    if (random_int < 21) {
        return 'a';
    }
    if (random_int < 30) {
        return 'i';
    }
    if (random_int < 38) {
        return 'o';
    }
    if (random_int < 44) {
        return 'n';
    }
    if (random_int < 50) {
        return 'r';
    }
    if (random_int < 56) {
        return 't';
    }
    if (random_int < 60) {
        return 'l';
    }
    if (random_int < 64) {
        return 's';
    }
    if (random_int < 68) {
        return 'u';
    }
    if (random_int < 72) {
        return 'd';
    }
    if (random_int < 75) {
        return 'g';
    }
    if (random_int < 77) {
        return 'b';
    }
    if (random_int < 79) {
        return 'c';
    }
    if (random_int < 81) {
        return 'm';
    }
    if (random_int < 83) {
        return 'p';
    }
    if (random_int < 85) {
        return 'f';
    }
    if (random_int < 87) {
        return 'h';
    }
    if (random_int < 89) {
        return 'v';
    }
    if (random_int < 91) {
        return 'w';
    }
    if (random_int < 93) {
        return 'y';
    }
    if (random_int < 94) {
        return 'k';
    }
    if (random_int < 95) {
        return 'j';
    }
    if (random_int < 96) {
        return 'x';
    }
    if (random_int < 97) {
        return 'q';
    }
    return 'z';
}


/* ----- TILE MANAGEMENT ----- */

/* Resets free tile position and gets new tiles. */
function reset_free_tiles() {
    game_free_tiles_column = 0;
    game_free_tiles_position_x = 0;
    game_free_tiles_position_y = -1 * LAYOUT_FREE_TILE_COUNT * layout_grid_size;
    game_free_tiles[0] = get_random_letter();
    game_free_tiles[1] = get_random_letter();
    game_free_tiles[2] = get_random_letter();
}

function shuffle_free_tiles() {
    const temp_letter = game_free_tiles[2];
    game_free_tiles[2] = game_free_tiles[1];
    game_free_tiles[1] = game_free_tiles[0];
    game_free_tiles[0] = temp_letter;
}

function get_column_height(column) {
    let return_data = 0;
    for (let height = 1; height <= LAYOUT_GRID_HEIGHT; height++) {
        if (game_tile_map[LAYOUT_GRID_HEIGHT - height][column] !== " ") {
           
            /* 
            //< ***** DEBUG START *****
            console.log(`Column Height: c:${column} h:${height}`);
            //> ***** DEBUG END ***** 
            */

            return_data =  height;
        }
    }
    return return_data;
}

/* ----- INPUT MANAGEMENT ----- */

function on_touch_start(event) {
    event.preventDefault();
    const touch = event.changedTouches[0];

    if (input_is_pressed) {
        return;
    }   

    if (game_stage == STAGE_ENUM_SPLASH) {
        game_stage = STAGE_ENUM_PLAYING;
        clear_screen();
        reset_free_tiles();
        initialize_clock();
        clock_frame_count = 1;
        setTimeout(log_fps, 1000);
        next_frame();
        return;
    }

    input_is_pressed = true;
 
    if ((touch.pageY > layout_up_button_zone_start) && (touch.pageY <= layout_up_button_zone_end)) {
        shuffle_free_tiles();
    } else if ((touch.pageY > layout_down_button_zone_start) && (touch.pageY <= layout_down_button_zone_end)) {
        game_drop_speed = FAST_DROP_SPEED;
    } else if ((touch.pageX > layout_left_button_zone_start) && (touch.pageX <= layout_left_button_zone_end)) {
        if (game_free_tiles_column > 0 && game_tile_map[pixel_to_grid(game_free_tiles_position_y + 
                (layout_grid_size * LAYOUT_FREE_TILE_COUNT))][game_free_tiles_column - 1] == " ")  {
            game_free_tiles_column--;
            game_free_tiles_position_x -= layout_grid_size;
        }
    } else if ((touch.pageX > layout_right_button_zone_start) && (touch.pageX <= layout_right_button_zone_end)) {
        if (game_free_tiles_column < LAYOUT_GRID_WIDTH - 1 && game_tile_map[pixel_to_grid(game_free_tiles_position_y +
                (layout_grid_size * LAYOUT_FREE_TILE_COUNT))][game_free_tiles_column + 1] == " ") {
            game_free_tiles_column++;
            game_free_tiles_position_x += layout_grid_size;
        }
    }
}

function on_touch_end(event) {
    input_is_pressed = false;
    game_drop_speed = BASE_DROP_SPEED;
}

function initialize_input() {
    input_is_pressed = false;
    element_canvas.addEventListener("touchstart", on_touch_start);
    element_canvas.addEventListener("touchend", on_touch_end);
}

/* ----- CLOCK MANAGEMENT ----- */

function sleep(seconds) {

    //< ***** DEBUG START *****
    console.log(`Sleeping: t:${seconds}`);
    //> ***** DEBUG END *****

    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function log_fps() {

    //< ***** DEBUG START *****
    
    clock_second_count++;
    clock_live_fps = clock_frame_count / clock_second_count;
    setTimeout(log_fps, 1000);   
 
    //> ***** DEBUG END *****

}

/* ----- MAIN FUNCTION AND DRIVER CODE ----- */

async function next_frame() {

    // Movement and collision
    const delta_time = Date.now() - clock_last_tick;
    const delta_position = (game_drop_speed * layout_grid_size * delta_time) / 1000;
    game_free_tiles_position_y += delta_position; 
    const column_height = get_column_height(game_free_tiles_column);
    if (
            (game_free_tiles_position_y + (LAYOUT_FREE_TILE_COUNT * layout_grid_size)) >= 
            (layout_screen_height - (column_height * layout_grid_size))) {
        
        // Collision ejection
        game_free_tiles_position_y = layout_screen_height - (column_height * layout_grid_size) - 
            (LAYOUT_FREE_TILE_COUNT * layout_grid_size);

        if (column_height > (LAYOUT_GRID_HEIGHT - LAYOUT_FREE_TILE_COUNT)) {

            //< ***** DEBUG START *****
            console.log("GAME OVER!!");
            //> ***** DEBUG END *****            

            game_background = COLOR_GAME_OVER;
            clear_screen();
            draw_tile_map();
            draw_tile(game_free_tiles_position_x, game_free_tiles_position_y, game_free_tiles[0], COLOR_TILE_BODY, 
                COLOR_TILE_BORDER);
            draw_tile(game_free_tiles_position_x, game_free_tiles_position_y + layout_grid_size, game_free_tiles[1],
                COLOR_TILE_BODY, COLOR_TILE_BORDER);
            draw_tile(game_free_tiles_position_x, game_free_tiles_position_y + (2 * layout_grid_size),
                game_free_tiles[2], COLOR_TILE_BODY, COLOR_TILE_BORDER);
            await sleep(3);

            game_background = COLOR_BACKGROUND;
            clear_screen();
            set_draw_color(COLOR_SPLASH_TEXT);
            set_draw_font(layout_game_over_small_font_size, FONT_TYPEFACE_MAIN);
            draw_text_center(layout_screen_height * LAYOUT_GAME_OVER_LINE_1_Y_RATIO, "you cleared");
            set_draw_font(layout_game_over_large_font_size, FONT_TYPEFACE_MAIN);
            draw_text_center(layout_screen_height * LAYOUT_GAME_OVER_LINE_2_Y_RATIO, `${game_score}`);
            set_draw_font(layout_game_over_small_font_size, FONT_TYPEFACE_MAIN);
            draw_text_center(layout_screen_height * LAYOUT_GAME_OVER_LINE_3_Y_RATIO, "blocks");
            draw_text_center(layout_screen_height * LAYOUT_GAME_OVER_LINE_4_Y_RATIO, "try again?");
            initialize_game_state();
            game_stage = STAGE_ENUM_SPLASH;

            return;             // GAME OVER! 
        }

        // Word Check

        game_tile_map[LAYOUT_GRID_HEIGHT - column_height - 1][game_free_tiles_column] = game_free_tiles[2];
        game_tile_map[LAYOUT_GRID_HEIGHT - column_height - 2][game_free_tiles_column] = game_free_tiles[1];
        game_tile_map[LAYOUT_GRID_HEIGHT - column_height - 3][game_free_tiles_column] = game_free_tiles[0];
        let found = false;
        let scan_row = LAYOUT_GRID_HEIGHT - 1;
        while (scan_row >= 0) {
            let row_string = "";
            let substring = "";
            for (let j = 0; j < LAYOUT_GRID_WIDTH; j++) {
                row_string += game_tile_map[scan_row][j];
            }
            for (let substring_start = 0; substring_start < LAYOUT_GRID_WIDTH; substring_start++) {
                for (let substring_length = LAYOUT_GRID_WIDTH; substring_length >= RULE_MIN_WORD_LENGTH;
                        substring_length--) {
                    const substring_end = substring_start + substring_length;
                    if (substring_end  > LAYOUT_GRID_WIDTH) {
                        continue;
                    }
                    substring = row_string.substring(substring_start, substring_end);
                    if (WORDS.words.indexOf(substring) != -1) {
                        found = true;
                        game_score += substring.length;

                        // Play flashing animation
                        let flash_body_color = COLOR_FLASH_A;
                        let flash_border_color = COLOR_FLASH_B;
                        for (let current_flash = 0; current_flash < ANIMATION_FLASH_COUNT; current_flash++) {   
                            if (flash_body_color == COLOR_FLASH_A) {
                                flash_body_color = COLOR_FLASH_B;
                                flash_border_color = COLOR_FLASH_A;
                            } else {
                                flash_body_color = COLOR_FLASH_A;
                                flash_border_color = COLOR_FLASH_B;
                            }
                            for (let current_tile_column = substring_start; current_tile_column < substring_end;
                                    current_tile_column++) {
                                draw_tile(current_tile_column * layout_grid_size, 
                                    scan_row * layout_grid_size, 
                                    substring.substring(current_tile_column - substring_start, 
                                        current_tile_column - substring_start + 1),
                                    flash_body_color,
                                    flash_border_color);
                            }
                            await sleep(ANIMATION_FLASH_LENGTH);
                        }

                        // Update tilemap
                        for (let current_tile_column = substring_start; current_tile_column < substring_end;
                                current_tile_column++) {
                            for (let current_tile_row = scan_row; current_tile_row > 0;
                                    current_tile_row--) {

                                // Shift tiles down:
                                game_tile_map[current_tile_row][current_tile_column] = 
                                    game_tile_map[current_tile_row - 1][current_tile_column];
                            }
                            game_tile_map[0][current_tile_column] = " ";
                        }
                        clear_screen();
                        draw_tile_map();
                        break;
                    }
                }
                if (found) {
                    break;
                }
            }
            
            // If a word was found, scan from the beginning.
            if (found) {
                found = false;
                scan_row = LAYOUT_GRID_HEIGHT;
            }
            scan_row--;
        }
        reset_free_tiles();
    }

    // Drawing
    draw_tile_map();
    draw_tile(game_free_tiles_position_x, game_free_tiles_position_y, game_free_tiles[0], COLOR_TILE_BODY, 
        COLOR_TILE_BORDER);
    draw_tile(game_free_tiles_position_x, game_free_tiles_position_y + layout_grid_size, game_free_tiles[1],
        COLOR_TILE_BODY, COLOR_TILE_BORDER);
    draw_tile(game_free_tiles_position_x, game_free_tiles_position_y + (2 * layout_grid_size),
        game_free_tiles[2], COLOR_TILE_BODY, COLOR_TILE_BORDER);

    //< ***** START DEBUG *****
    /*
    set_draw_color(COLOR_DEBUG_TEXT);
    set_draw_font(LAYOUT_DEBUG_FONT_SIZE, FONT_TYPEFACE_MAIN);
    draw_text_center(32, `FPS: ${clock_live_fps}`); 
    */
    //> ***** END DEBUG *****

    clock_frame_count++;
    clock_last_tick = Date.now();
    setTimeout(next_frame, CLOCK_MINIMUM_FRAME_DURATION);

    /*
    //< ***** DEBUG START *****
    console.log(`Free Tiles Position: (${game_free_tiles_position_x}, ${game_free_tiles_position_y})`);
    //> ***** DEBUG END *****
    */
}

function main() {
    initialize_elements();
    initialize_contexts();
    initialize_layout();
    initialize_game_state();
    initialize_input();

    clear_screen();
    set_draw_color(COLOR_SPLASH_TEXT);
    set_draw_font(layout_splash_title_font_size, FONT_TYPEFACE_MAIN);
    draw_text_center(layout_screen_height * LAYOUT_SPLASH_TITLE_Y_RATIO, "letris");
    set_draw_font(layout_splash_body_font_size, FONT_TYPEFACE_MAIN);
    draw_text_center(layout_screen_height * LAYOUT_SPLASH_BODY_Y_RATIO, "tap to start");
    set_draw_font(layout_splash_version_font_size, FONT_TYPEFACE_MAIN);
    draw_text_center(layout_screen_height * LAYOUT_SPLASH_VERSION_Y_RATIO, `ver. ${VERSION_NUMBER}`);
}

window.addEventListener("load", main);
