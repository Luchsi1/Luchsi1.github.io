import json
import math
import random

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.image import Image
from kivy.uix.label import Label
from kivy.clock import Clock
from kivy.uix.relativelayout import RelativeLayout

from MyLabel_Class import MyLabel
from BorderButton_Class import BorderButton

class FourFlagsQuiz(BoxLayout):

    def __init__(self, region, quiz_type, **kwargs):
        super().__init__(orientation="vertical", **kwargs)

        if quiz_type == "countries":
            with open(f"options/regions/{region}.json", "r", encoding="utf8") as f:
                self.items = json.load(f)
        elif quiz_type == "capitals":
            with open(f"options/capitals/{region} capitals.json", "r", encoding="utf8") as f:
                self.items = json.load(f)
        elif quiz_type == "firstlevel":
            with open(f"options/firstlevel/{region} firstlevel.json", "r", encoding="utf8") as f:
                self.items = json.load(f)
        elif quiz_type == "secondlevel":
            with open(f"options/secondlevel/{region} secondlevel.json", "r", encoding="utf8") as f:
                self.items = json.load(f)

        if len(self.items) >= 30:
            self.advanced_randomness = True
            self.previous_questions = []
        else:
            self.advanced_randomness = False

        self.score = 0
        self.hp = 3

        self.score_label = MyLabel(
            text="Score: 0",
            size_hint=(1, 0.1),
            rect_color=(0.1, 0.1, 0.1, 1)
        )

        self.hp_label = MyLabel(
            text="HP: 3",
            size_hint=(1, 0.1),
            rect_color=(0.1, 0.1, 0.1, 1)
        )

        self.name = MyLabel(
            text="",
            size_hint=(1, 0.6),
            rect_color=(0.05, 0.05, 0.05, 1),
            font_size=75
        )

        self.answer_layout = GridLayout(
            cols=2,
            rows=2,
            size_hint=(1, 1),
        )

        self.name.bind(size=self.update_font_size)
        self.answer_layout.bind(size=self.update_slot_sizes)

        self.add_widget(self.score_label)
        self.add_widget(self.hp_label)
        self.add_widget(self.name)
        self.add_widget(self.answer_layout)

        self.next_question()

    def update_slot_sizes(self, *args):
        if not self.answer_layout.children:
            return

        if self.answer_layout.height <= 0:
            return

        cols = self.answer_layout.cols or 1
        rows = max(1, (len(self.answer_layout.children) + cols - 1) // cols)
        self.answer_layout.rows = rows

        available_height = self.answer_layout.height
        slot_height = available_height / rows

        for child in self.answer_layout.children:
            child.size_hint = (1, None)
            child.height = slot_height

    def update_font_size(self, *args):
        if not self.name:
            return
        
        self.name.font_size = min(self.name.width, self.name.height) * 0.2

    def layout_flag(self, container, image):
        if container.width <= 0 or container.height <= 0:
            return

        image.texture_update()
        tw, th = image.texture_size

        if tw <= 0 or th <= 0:
            return

        ratio = tw / th
        max_w = container.width * 0.9
        max_h = container.height * 0.9

        if max_w / max_h > ratio:
            new_h = max_h
            new_w = new_h * ratio
        else:
            new_w = max_w
            new_h = new_w / ratio

        image.size = (new_w, new_h)
        image.pos = (
            container.width / 2 - new_w / 2,
            container.height / 2 - new_h / 2
        )

    def next_question(self):
        if self.advanced_randomness:
            if len(self.previous_questions) >= math.ceil(len(self.items) * 0.75):
                self.previous_questions.pop(0)
            
            
            self.correct = random.choice(self.items)
            while self.correct in self.previous_questions:
                self.correct = random.choice(self.items)
            
            self.previous_questions.append(self.correct)
        else:
            self.correct = random.choice(self.items)


        options = [self.correct]
        count = 0
        while len(options) < 4:
            candidate = random.choice(self.items)
            if candidate not in options:
                options.append(candidate)
            count += 1
            if count > 20:
                break

        random.shuffle(options)

        self.name.text = self.correct["name"]
        self.answer_layout.clear_widgets()

        for option in options:
            slot = RelativeLayout(
                size_hint=(1, None),
                height=100
            )

            btn = BorderButton(
                text="",
                size_hint=(1, 1),
                background_color=(1, 1, 1, 0),
                border_color=(0.5, 0.5, 0.5, 1),
                border_width=2
            )

            img = Image(
                source=option["flag"],
                allow_stretch=False,
                keep_ratio=True,
                size_hint=(None, None)
            )

            # add image first, then button so the button remains clickable
            slot.add_widget(img)
            slot.add_widget(btn)

            btn.bind(on_press=lambda b, o=option: self.check_answer(o))

            slot.bind(
                size=lambda instance, value, i=img: self.layout_flag(instance, i),
                pos=lambda instance, value, i=img: self.layout_flag(instance, i)
            )

            Clock.schedule_once(
                lambda dt, s=slot, i=img: self.layout_flag(s, i),
                0
            )

            self.answer_layout.add_widget(slot)

        self.update_slot_sizes()
        self.update_font_size()
        

    def check_answer(self, option):
        if option == self.correct:
            self.score += 1
            self.score_label.text = f"Score: {self.score}"
            self.next_question()
        else:
            self.hp -= 1
            self.hp_label.text = f"HP: {self.hp}"
            if self.hp == 0:
                self.death_screen()
                
                
    def death_screen(self):
        self.clear_widgets()
        self.add_widget(Label(text="Game Over!", size_hint=(1, 0.5)))
        self.add_widget(Label(text=f"Final Score: {self.score}", size_hint=(1, 0.5)))
        button = BorderButton(
            text="back to main menu",
            size_hint=(1, 1),
            background_color=(0.1, 0.1, 0.1, 1),
            border_color=(0.5, 0.5, 0.5, 1),
            border_width=2
            )
        from back_to_menu import back_to_menu
        button.bind(on_press=back_to_menu)
        self.add_widget(button)