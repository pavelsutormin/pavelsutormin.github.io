import asyncio
import math
import random

import pygame

GRID_WIDTH, GRID_HEIGHT = 96, 54
GRID_SIZE = 20
WIDTH, HEIGHT = GRID_WIDTH * GRID_SIZE, GRID_HEIGHT * GRID_SIZE
PLAYER_SPEED_X = 0.5
PLAYER_SPEED_Y = 0.5
GRAVITY = 0.2
pygame.init()
fps_clock = pygame.time.Clock()
font = pygame.font.Font('SourceCodePro.ttf', 16)
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Paper Engine")


def approach_zero(number, amount):
    if abs(number) < amount:
        return 0
    elif number > 0:
        return number - amount
    elif number < 0:
        return number + amount
    else:
        return 0


def is_line_touching_circle(pos1, pos2, cx, cy, c_radius):
    line_length = math.sqrt((pos2[0] - pos1[0]) ** 2 + (pos2[1] - pos1[1]) ** 2)
    if int(line_length) > 0:
        test_length = int(line_length) + 1
        delta_x = (pos2[0] - pos1[0]) / test_length
        delta_y = (pos2[1] - pos1[1]) / test_length
        for test_count in range(test_length + 1):
            point_x = pos1[0] + round(delta_x * test_count)
            point_y = pos1[1] + round(delta_y * test_count)
            dist_from_center = math.sqrt((cx - point_x) ** 2 + (cy - point_y) ** 2)
            if dist_from_center <= c_radius:
                return True
    return False


class Player:
    def __init__(self, radius=20, start_x=0, start_y=0, color=(255, 0, 0)):
        self.velocity = [0.0, 0.0]
        self.radius = radius
        self.x = start_x
        self.y = start_y
        self.color = color

    def update(self, lines):
        self.velocity[0] = approach_zero(self.velocity[0], PLAYER_SPEED_X / 20)
        self.velocity[1] = approach_zero(self.velocity[1], PLAYER_SPEED_Y / 20)
        self.x += self.velocity[0]
        self.y += self.velocity[1]
        for line in lines:
            start_pos = (line[0][0] * GRID_SIZE, line[0][1] * GRID_SIZE)
            end_pos = (line[1][0] * GRID_SIZE, line[1][1] * GRID_SIZE)
            while is_line_touching_circle(start_pos, end_pos, self.x, self.y, self.radius):
                if self.velocity[0] != 0:
                    self.x -= self.velocity[0]
                    self.velocity[0] = -self.velocity[0] / 5
                if self.velocity[1] != 0:
                    self.y -= self.velocity[1]
                    self.velocity[1] = -self.velocity[1] / 5
        if self.x < self.radius:
            self.x = self.radius
            self.velocity[0] = -self.velocity[0] / 5
        if self.x > WIDTH - self.radius:
            self.x = WIDTH - self.radius
            self.velocity[0] = -self.velocity[0] / 5
        if self.y < self.radius:
            self.y = self.radius
            self.velocity[1] = -self.velocity[1] / 5
        if self.y > HEIGHT - self.radius:
            self.y = HEIGHT - self.radius
            self.velocity[1] = -self.velocity[1] / 5
        pygame.draw.circle(screen, self.color, (self.x, self.y), self.radius, 4)


lines = [
    [[5, 5], [10, 5]],
    [[10, 5], [10, 10]],
    [[10, 10], [5, 10]],
    [[5, 10], [5, 5]]
]

heights = []
keys = []

for i in range(0, GRID_WIDTH):
    heights.append(GRID_HEIGHT - random.randint(1, GRID_HEIGHT // 2))
    keys.append(i)

heights.sort()

i = 0

for i in range(1, GRID_WIDTH):
    lines.append([[keys[i - 1], heights[i - 1]], [keys[i], heights[i]]])

lines.append([[keys[i], heights[i]], [keys[i] + 1, heights[i]]])


async def main():
    running = True
    player = Player(start_x=WIDTH // 2, start_y=HEIGHT // 2, color=(0, 0, 0))
    move_left = False
    move_right = False
    move_up = False
    move_down = False
    mouse_down = False
    mouse_start = [0, 0]
    while running:
        mouse_pos = pygame.mouse.get_pos()
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                exit(0)
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    move_left = True
                if event.key == pygame.K_RIGHT:
                    move_right = True
                if event.key == pygame.K_UP:
                    move_up = True
                if event.key == pygame.K_DOWN:
                    move_down = True
                if event.key == pygame.K_o:
                    if lines[1] == [[10, 5], [10, 10]]:
                        lines[1] = [[10, 5], [15, 5]]
                    elif lines[1] == [[10, 5], [15, 5]]:
                        lines[1] = [[10, 5], [10, 10]]
            elif event.type == pygame.KEYUP:
                if event.key == pygame.K_LEFT:
                    move_left = False
                if event.key == pygame.K_RIGHT:
                    move_right = False
                if event.key == pygame.K_UP:
                    move_up = False
                if event.key == pygame.K_DOWN:
                    move_down = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                mouse_down = True
                mouse_start = [round(mouse_pos[0] / GRID_SIZE), round(mouse_pos[1] / GRID_SIZE)]
            elif event.type == pygame.MOUSEBUTTONUP:
                mouse_down = False
                place_pos = [round(mouse_pos[0] / GRID_SIZE), round(mouse_pos[1] // GRID_SIZE)]
                if place_pos != mouse_start:
                    if not [mouse_start, place_pos] in lines:
                        lines.append([mouse_start, place_pos])

        screen.fill((255, 255, 255))
        for x in range(0, WIDTH, GRID_SIZE):
            for y in range(0, HEIGHT, GRID_SIZE):
                rect = pygame.Rect(x, y, GRID_SIZE, GRID_SIZE)
                pygame.draw.rect(screen, (173, 216, 230), rect, 1)

        snapped_mouse_pos = [round(mouse_pos[0] / GRID_SIZE) * GRID_SIZE, round(mouse_pos[1] / GRID_SIZE) * GRID_SIZE]

        for line in lines:
            start_pos = (line[0][0] * GRID_SIZE, line[0][1] * GRID_SIZE)
            end_pos = (line[1][0] * GRID_SIZE, line[1][1] * GRID_SIZE)
            pygame.draw.line(screen, (0, 0, 0), start_pos, end_pos, 2)

        if mouse_down:
            start_pos = [mouse_start[0] * GRID_SIZE, mouse_start[1] * GRID_SIZE]
            pygame.draw.line(screen, (0, 0, 0), start_pos, snapped_mouse_pos, 2)

        pygame.draw.circle(screen, (255, 0, 0), snapped_mouse_pos, 3, 1)

        if move_left:
            player.velocity[0] -= PLAYER_SPEED_X
        if move_right:
            player.velocity[0] += PLAYER_SPEED_X
        if move_up:
            player.velocity[1] -= PLAYER_SPEED_Y
        if move_down:
            player.velocity[1] += PLAYER_SPEED_Y
        else:
            player.velocity[1] += GRAVITY

        player.update(lines)

        fps_text = font.render(f"FPS: {round(fps_clock.get_fps(), 2)}", True, (0, 0, 0))
        screen.blit(fps_text, (0, 0))

        pygame.display.flip()
        fps_clock.tick(60)


asyncio.run(main())
