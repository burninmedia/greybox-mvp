#!/bin/bash
set -e

NEXT_OUT=".next/server/app"
DEPLOY_OUT="out"
NEXT_STATIC=".next/static"
BASE_PATH="/greybox-mvp"

echo "==> Extracting static export for GitHub Pages..."

rm -rf "$DEPLOY_OUT"
mkdir -p "$DEPLOY_OUT"

# Pages in .next/server/app/*.html are flat, e.g. sign-in.html, dashboard.html
# We need to put them in subdirs so routing works (sign-in/index.html, etc.)
for html_file in "$NEXT_OUT"/*.html; do
  [ -f "$html_file" ] || continue
  filename=$(basename "$html_file")
  
  if [ "$filename" = "index.html" ]; then
    cp "$html_file" "$DEPLOY_OUT/index.html"
    echo "  $filename -> /index.html"
  elif [ "$filename" = "_not-found.html" ]; then
    mkdir -p "$DEPLOY_OUT/404"
    cp "$html_file" "$DEPLOY_OUT/404/index.html"
    echo "  $filename -> /404/index.html"
  else
    # sign-in.html -> sign-in/index.html
    routename="${filename%.html}"
    mkdir -p "$DEPLOY_OUT/$routename"
    cp "$html_file" "$DEPLOY_OUT/$routename/index.html"
    echo "  $filename -> /$routename/index.html"
  fi
done

# Also handle sub-route pages if any exist (e.g., app/dashboard/page.html)
find "$NEXT_OUT" -mindepth 2 -name "*.html" 2>/dev/null | while read -r html_file; do
  # Get path relative to NEXT_OUT, e.g. "dashboard/page.html"
  rel="${html_file#$NEXT_OUT/}"
  dest="$DEPLOY_OUT/$rel"
  mkdir -p "$(dirname "$dest")"
  cp "$html_file" "$dest"
  echo "  $rel -> /$rel"
done

# Copy _next/static to out/_next/static
if [ -d "$NEXT_STATIC" ]; then
  echo "==> Copying static assets..."
  cp -r "$NEXT_STATIC" "$DEPLOY_OUT/_next"
fi

echo ""
echo "==> Verifying output..."
find "$DEPLOY_OUT" -type f | sort

echo ""
echo "==> Export complete."
