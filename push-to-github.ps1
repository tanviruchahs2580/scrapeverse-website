# Run after: gh auth login
# Creates GitHub repo and pushes this project

$ErrorActionPreference = "Stop"
$repoName = "scrapeverse-website"

Set-Location $PSScriptRoot

gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to GitHub. Run: gh auth login" -ForegroundColor Yellow
    exit 1
}

$remotes = git remote 2>$null
if ($remotes -match "origin") {
    Write-Host "Remote 'origin' already exists. Pushing..."
    git push -u origin main
} else {
    Write-Host "Creating repo '$repoName' and pushing..."
    gh repo create $repoName --public --source=. --remote=origin --push
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Done! View at: https://github.com/$(gh api user -q .login)/$repoName" -ForegroundColor Green
}
