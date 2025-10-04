#!/usr/bin/env python3

# Copyright (C) 2025 - Kristoffer A. Wright - All Rights Reserved

import json
import sys

def main():
    out = {"words": []}
    with open(sys.argv[1]) as fp:
        raw_words = fp.read()
    for raw_word in raw_words.split():
        if (len(raw_word) < 3) or (len(raw_word) > 6):
            continue
        out["words"].append(raw_word)
        print(f"Added '{raw_word}'")
    out_str = json.dumps(out)
    out_str = f"var WORDS = {out_str};\n"
    with open("words.js", "w") as fp:
        fp.write(out_str)
    print("Wrote dictionary to 'words.js'")

if __name__ == "__main__":
    main()
    exit(0)

