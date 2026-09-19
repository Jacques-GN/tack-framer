#!/bin/bash
# Test UI end-to-end SnapSite v2 : scan -> wizard 3 étapes -> export ZIP
set -u
cd /home/z/my-project

URL_TEST="https://clavion-wbs.framer.website/"

# 1) Start dev server (dies with this script — sandbox reaps children)
# Thorough cleanup: kill every leftover next/bun/tee/postcss process
pkill -9 -f "next-server" 2>/dev/null; pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "postcss.js" 2>/dev/null; pkill -9 -f "bun run dev" 2>/dev/null
for i in $(seq 1 15); do
  ss -tln 2>/dev/null | grep -q ":3000 " || break
  fuser -k 3000/tcp 2>/dev/null; sleep 1
done
rm -rf .next
setsid nohup bun run dev > /dev/null 2>&1 < /dev/null &
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 2
done
echo "=== server HTTP:$code ==="

# 1b) API sanity check (scan)
echo "=== API scan test ==="
curl -s -X POST http://localhost:3000/api/scan -H "content-type: application/json" \
  -d "{\"url\":\"$URL_TEST\"}" --max-time 90 | head -c 200; echo

agent-browser set viewport 1440 900
agent-browser navigate "http://localhost:3000" && sleep 3
agent-browser screenshot /tmp/e2e-01-home.png

# 2) Fill URL + start scan
SNAP=$(agent-browser snapshot)
REF_INPUT=$(echo "$SNAP" | grep 'textbox "Website URL"' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
REF_BTN=$(echo "$SNAP" | grep 'button "Export Site"' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
echo "input=$REF_INPUT btn=$REF_BTN"
agent-browser type "$REF_INPUT" "$URL_TEST"
agent-browser click "$REF_BTN"

# 3) Wait for scan: poll until "N sur M sélectionnées" with N>0 (max 120 s)
COUNT=""
for i in $(seq 1 60); do
  COUNT=$(agent-browser snapshot 2>/dev/null | grep -oE '"[0-9]+ sur [0-9]+ sélectionnées"' | grep -oE '^[^ ]+' | tr -d '"')
  if [ -n "$COUNT" ] && [ "${COUNT%% *}" != "0" ]; then break; fi
  sleep 2
done
echo "=== selection count: ${COUNT:-NONE} ==="
agent-browser screenshot /tmp/e2e-02-wizard-step1.png

# 4) Step 1 -> 2
SNAP=$(agent-browser snapshot)
REF_CONT=$(echo "$SNAP" | grep 'button "Continuer"' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
echo "continuer1=$REF_CONT"
agent-browser click "$REF_CONT"
sleep 2
agent-browser screenshot /tmp/e2e-03-wizard-step2.png

# 5) Step 2 -> 3
SNAP=$(agent-browser snapshot)
REF_CONT2=$(echo "$SNAP" | grep 'button "Continuer"' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
echo "continuer2=$REF_CONT2"
agent-browser click "$REF_CONT2"
sleep 2
agent-browser screenshot /tmp/e2e-04-wizard-step3.png

# 6) Start export
SNAP=$(agent-browser snapshot)
REF_GO=$(echo "$SNAP" | grep -oE 'button "Démarrer[^"]*"' | head -1)
REF_GO_REF=$(echo "$SNAP" | grep 'button "Démarrer' | grep -o 'ref=e[0-9]*' | head -1 | sed 's/ref=//')
echo "go label: $REF_GO_REF"
agent-browser click "$REF_GO_REF"

# 7) Wait for completion (poll up to 150 s)
RESULT=""
for i in $(seq 1 75); do
  S=$(agent-browser snapshot 2>/dev/null)
  if echo "$S" | grep -q "Exportation terminée"; then RESULT="DONE"; break; fi
  if echo "$S" | grep -q "Échec de l.exportation"; then RESULT="FAILED"; break; fi
  sleep 2
done
echo "=== export result: $RESULT ==="
agent-browser screenshot /tmp/e2e-05-done.png
agent-browser snapshot 2>/dev/null | grep -E "terminée|pages HTML|Fichiers|ZIP|[0-9.]+ Mo|Échec" | head -8
echo "=== E2E TEST COMPLETE ==="
