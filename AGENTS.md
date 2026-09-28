<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep prototype onboarding, booking, profile, and ride data in the shared local store; this preserves one migration path to persistent storage later.
- Model future ride-join approval as a separate request carrying a rider score snapshot; this avoids coupling approvals to the current instant-join action.
