#!/bin/bash

# Audio compression script for piano sounds
# Compresses MP3 files to reduce size while maintaining quality

echo "Starting audio compression..."

# Create backup directory
mkdir -p public/piano_keys_backup

# Backup original files
cp -r public/piano_keys/* public/piano_keys_backup/

# Create compressed directory
mkdir -p public/piano_keys_compressed

# Compress audio files with lower bitrate and mono for mobile optimization
for file in public/piano_keys/*.mp3; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "Compressing $filename..."
        
        # Convert to 32kbps mono MP3 for much smaller size
        ffmpeg -i "$file" -acodec mp3 -ab 32k -ac 1 -ar 22050 "public/piano_keys_compressed/$filename" -y 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✓ Compressed $filename"
        else
            echo "✗ Failed to compress $filename"
        fi
    fi
done

echo "Compression complete!"
echo "Original size: $(du -sh public/piano_keys_backup | cut -f1)"
echo "Compressed size: $(du -sh public/piano_keys_compressed | cut -f1)"

# Replace original files if compression was successful
if [ -d "public/piano_keys_compressed" ] && [ "$(ls -A public/piano_keys_compressed)" ]; then
    echo "Replacing original files with compressed versions..."
    rm -rf public/piano_keys
    mv public/piano_keys_compressed public/piano_keys
    echo "✓ Files replaced successfully"
else
    echo "✗ Compression failed, keeping original files"
fi
