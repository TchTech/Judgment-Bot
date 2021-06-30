import discord
from discord.ext import commands
from discord_slash import SlashCommand, SlashContext

bot = commands.Bot(command_prefix="b!", intents=discord.Intents.all())
guild_ids = [799721866884546561, 804772492978946089]
slash = SlashCommand(bot, True)
@slash.slash(
    name="ttest",
    description="Sends message.",
    guild_ids=guild_ids
)
async def _test(ctx: SlashContext):
    embed = discord.Embed(title="embed test")
    await ctx.send(content='test', embeds=[embed])

bot.run("Nzk5NzIzNDEwNTcyODM2ODc0.YAHudw.fkJYOlVps7m1Oq_jJfvbDqypSSU")